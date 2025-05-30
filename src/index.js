const path = require("path");
const os = require("os");

const { validate } = require("schema-utils");

const worker = require("./worker");
const schema = require("./plugin-options.json");
const {
  throttleAll,
  memoize,
  imageminNormalizeConfig,
  imageminMinify,
  imageminGenerate,
  squooshMinify,
  squooshGenerate,
  sharpMinify,
  sharpGenerate,
  svgoMinify,
  IMAGE_MINIMIZER_PLUGIN_INFO_MAPPINGS,
} = require("./utils.js");

/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").WebpackPluginInstance} WebpackPluginInstance */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {import("webpack").WebpackError} WebpackError */
/** @typedef {import("webpack").Asset} Asset */
/** @typedef {import("webpack").AssetInfo} AssetInfo */
/** @typedef {import("webpack").sources.Source} Source */
/** @typedef {import("webpack").Module} Module */
/** @typedef {import("./utils.js").imageminMinify} ImageminMinifyFunction */
/** @typedef {import("./utils.js").squooshMinify} SquooshMinifyFunction */

/** @typedef {RegExp | string} Rule */
/** @typedef {Rule[] | Rule} Rules */

/**
 * @callback FilterFn
 * @param {Buffer} source `Buffer` of source file.
 * @param {string} sourcePath Absolute path to source.
 * @returns {boolean}
 */

/**
 * @typedef {Object} ImageminOptions
 * @property {Array<string | [string, Record<string, any>?] | import("imagemin").Plugin>} plugins
 */

/**
 * @typedef {Object.<string, any>} SquooshOptions
 */

/**
 * @typedef {Object} WorkerResult
 * @property {string} filename
 * @property {Buffer} data
 * @property {Array<Error>} warnings
 * @property {Array<Error>} errors
 * @property {AssetInfo} info
 */

/**
 * @template T
 * @typedef {Object} Task
 * @property {string} name
 * @property {AssetInfo} info
 * @property {Source} inputSource
 * @property {WorkerResult & { source?: Source } | undefined} output
 * @property {ReturnType<ReturnType<Compilation["getCache"]>["getItemCache"]>} cacheItem
 * @property {Transformer<T> | Transformer<T>[]} transformer
 */

/**
 * @typedef {{ [key: string]: any }} CustomOptions
 */

/**
 * @template T
 * @typedef {T extends infer U ? U : CustomOptions} InferDefaultType
 */

/**
 * @template T
 * @typedef {InferDefaultType<T> | undefined} BasicTransformerOptions
 */

/**
 * @typedef {Object} ResizeOptions
 * @property {number} [width]
 * @property {number} [height]
 * @property {"px" | "percent"} [unit]
 * @property {boolean} [enabled]
 */

/**
 * @template T
 * @callback BasicTransformerImplementation
 * @param {WorkerResult} original
 * @param {BasicTransformerOptions<T>} [options]
 * @returns {Promise<WorkerResult | null>}
 */

/**
 * @typedef {Object} BasicTransformerHelpers
 * @property {() => void} [setup]
 * @property {() => void} [teardown]
 */

/**
 * @template T
 * @typedef {BasicTransformerImplementation<T> & BasicTransformerHelpers} TransformerFunction
 */

/**
 * @typedef {Object} PathData
 * @property {string} [filename]
 */

/**
 * @callback FilenameFn
 * @param {PathData} pathData
 * @param {AssetInfo} [assetInfo]
 * @returns {string}
 */

/**
 * @template T
 * @typedef {Object} Transformer
 * @property {TransformerFunction<T>} implementation
 * @property {BasicTransformerOptions<T>} [options]
 * @property {FilterFn} [filter]
 * @property {string | FilenameFn} [filename]
 * @property {string} [preset]
 * @property {"import" | "asset"} [type]
 */

/**
 * @template T
 * @typedef {Omit<Transformer<T>, "preset" | "type">} Minimizer
 */

/**
 * @template T
 * @typedef {Transformer<T>} Generator
 */

/**
 * @template T
 * @typedef {Object} InternalWorkerOptions
 * @property {string} filename
 * @property {AssetInfo=} info
 * @property {Buffer} input
 * @property {Transformer<T> | Transformer<T>[]} transformer
 * @property {string} [severityError]
 * @property {Function} [generateFilename]
 */

/**
 * @template T
 * @typedef {import("./loader").LoaderOptions<T>} InternalLoaderOptions
 */

/**
 * @template T, G
 * @typedef {Object} PluginOptions
 * @property {Rule} [test] Test to match files against.
 * @property {Rule} [include] Files to include.
 * @property {Rule} [exclude] Files to exclude.
 * @property {T extends any[] ? { [P in keyof T]: Minimizer<T[P]> } : Minimizer<T> | Minimizer<T>[]} [minimizer] Allows to setup the minimizer.
 * @property {G extends any[] ? { [P in keyof G]: Generator<G[P]> } : Generator<G>[]} [generator] Allows to set the generator.
 * @property {boolean} [loader] Automatically adding `imagemin-loader`.
 * @property {number} [concurrency] Maximum number of concurrency optimization processes in one time.
 * @property {string} [severityError] Allows to choose how errors are displayed.
 * @property {boolean} [deleteOriginalAssets] Allows to remove original assets. Useful for converting to a `webp` and remove original assets.
 */

const getSerializeJavascript = memoize(() => require("serialize-javascript"));

/**
 * @template T, [G=T]
 * @extends {WebpackPluginInstance}
 */
class ImageMinimizerPlugin {
  /**
   * @param {PluginOptions<T, G>} [options={}] Plugin options.
   */
  constructor(options = {}) {
    validate(/** @type {Schema} */ (schema), options, {
      name: "Image Minimizer Plugin",
      baseDataPath: "options",
    });

    const {
      minimizer,
      test = /\.(jpe?g|png|gif|tif|webp|svg|avif|jxl)$/i,
      include,
      exclude,
      severityError,
      generator,
      loader = true,
      concurrency,
      deleteOriginalAssets = true,
    } = options;

    if (!minimizer && !generator) {
      throw new Error(
        "Not configured 'minimizer' or 'generator' options, please setup them",
      );
    }

    /**
     * @private
     */
    this.options = {
      minimizer,
      generator,
      severityError,
      exclude,
      include,
      loader,
      concurrency,
      test,
      deleteOriginalAssets,
    };
  }

  /**
   * @private
   * @param {Compiler} compiler
   * @param {Compilation} compilation
   * @param {Record<string, Source>} assets
   * @returns {Promise<void>}
   */
  async optimize(compiler, compilation, assets) {
    const minimizers =
      typeof this.options.minimizer !== "undefined"
        ? Array.isArray(this.options.minimizer)
          ? this.options.minimizer
          : [this.options.minimizer]
        : [];

    const generators = Array.isArray(this.options.generator)
      ? this.options.generator.filter((item) => item.type === "asset")
      : [];

    if (minimizers.length === 0 && generators.length === 0) {
      return;
    }

    const cache = compilation.getCache("ImageMinimizerWebpackPlugin");
    const assetsForTransformers = (
      await Promise.all(
        Object.keys(assets)
          .filter((name) => {
            const { info } = /** @type {Asset} */ (compilation.getAsset(name));

            // Skip double minimize assets from child compilation
            if (info.minimized || info.generated) {
              return false;
            }

            if (
              !compiler.webpack.ModuleFilenameHelpers.matchObject(
                this.options,
                name,
              )
            ) {
              return false;
            }

            return true;
          })
          .map(async (name) => {
            const { info, source } = /** @type {Asset} */ (
              compilation.getAsset(name)
            );

            /**
             * @template Z
             * @param {Transformer<Z> | Array<Transformer<Z>>} transformer
             * @returns {Promise<Task<Z>>}
             */
            const getFromCache = async (transformer) => {
              const cacheName = getSerializeJavascript()({ name, transformer });
              const eTag = cache.getLazyHashedEtag(source);
              const cacheItem = cache.getItemCache(cacheName, eTag);
              const output = await cacheItem.getPromise();

              return {
                name,
                info,
                inputSource: source,
                output,
                cacheItem,
                transformer,
              };
            };

            /**
             * @type {Task<T | G>[]}
             */
            const tasks = [];

            if (generators.length > 0) {
              tasks.push(
                ...(await Promise.all(
                  generators.map((generator) => getFromCache(generator)),
                )),
              );
            }

            if (minimizers.length > 0) {
              tasks.push(
                await getFromCache(
                  /** @type {Minimizer<T>[]} */
                  (minimizers),
                ),
              );
            }

            return tasks;
          }),
      )
    ).flat();

    // In some cases cpus() returns undefined
    // https://github.com/nodejs/node/issues/19022
    const limit = Math.max(
      1,
      this.options.concurrency ?? os.cpus()?.length ?? 1,
    );
    const { RawSource } = compiler.webpack.sources;

    const scheduledTasks = assetsForTransformers.map((asset) => async () => {
      const { name, info, inputSource, cacheItem, transformer } = asset;
      let { output } = asset;
      let input;

      const sourceFromInputSource = inputSource.source();

      if (!output) {
        input = sourceFromInputSource;

        if (!Buffer.isBuffer(input)) {
          input = Buffer.from(input);
        }

        const minifyOptions =
          /** @type {InternalWorkerOptions<T>} */
          ({
            filename: name,
            info,
            input,
            severityError: this.options.severityError,
            transformer,
            generateFilename: compilation.getAssetPath.bind(compilation),
          });

        output = await worker(minifyOptions);

        output.source = new RawSource(output.data);

        await cacheItem.storePromise({
          source: output.source,
          info: output.info,
          filename: output.filename,
          warnings: output.warnings,
          errors: output.errors,
        });
      }

      compilation.warnings = [
        ...compilation.warnings,
        .../** @type {[WebpackError]} */ (output.warnings),
      ];

      compilation.errors = [
        ...compilation.errors,
        .../** @type {[WebpackError]} */ (output.errors),
      ];

      if (compilation.getAsset(output.filename)) {
        compilation.updateAsset(
          output.filename,
          /** @type {Source} */ (output.source),
          output.info,
        );
      } else {
        compilation.emitAsset(
          output.filename,
          /** @type {Source} */ (output.source),
          output.info,
        );

        if (this.options.deleteOriginalAssets) {
          compilation.deleteAsset(name);
        }
      }
    });

    await throttleAll(limit, scheduledTasks);
  }

  /**
   * @private
   */
  setupAll() {
    if (Array.isArray(this.options.generator)) {
      const { generator } = this.options;

      for (const item of generator) {
        if (typeof item.implementation.setup === "function") {
          item.implementation.setup();
        }
      }
    }

    if (typeof this.options.minimizer !== "undefined") {
      const minimizers = Array.isArray(this.options.minimizer)
        ? this.options.minimizer
        : [this.options.minimizer];

      for (const item of minimizers) {
        if (typeof item.implementation.setup === "function") {
          item.implementation.setup();
        }
      }
    }
  }

  /**
   * @private
   */
  async teardownAll() {
    if (Array.isArray(this.options.generator)) {
      const { generator } = this.options;

      for (const item of generator) {
        if (typeof item.implementation.teardown === "function") {
          // eslint-disable-next-line no-await-in-loop
          await item.implementation.teardown();
        }
      }
    }

    if (typeof this.options.minimizer !== "undefined") {
      const minimizers = Array.isArray(this.options.minimizer)
        ? this.options.minimizer
        : [this.options.minimizer];

      for (const item of minimizers) {
        if (typeof item.implementation.teardown === "function") {
          // eslint-disable-next-line no-await-in-loop
          await item.implementation.teardown();
        }
      }
    }
  }

  /**
   * @param {import("webpack").Compiler} compiler
   */
  apply(compiler) {
    const pluginName = this.constructor.name;

    this.setupAll();

    if (this.options.loader) {
      compiler.hooks.compilation.tap({ name: pluginName }, (compilation) => {
        // Collect asset and update info from old loaders
        compilation.hooks.moduleAsset.tap(
          { name: pluginName },
          (module, file) => {
            const newInfo = IMAGE_MINIMIZER_PLUGIN_INFO_MAPPINGS.get(module);

            if (newInfo) {
              const asset = /** @type {Asset} */ (compilation.getAsset(file));

              compilation.updateAsset(file, asset.source, newInfo);
            }
          },
        );

        // Collect asset modules and update info for asset modules
        compilation.hooks.assetPath.tap(
          { name: pluginName },
          (filename, data, info) => {
            const newInfo =
              /** @type {{ module: Module }} */
              (data)?.module
                ? IMAGE_MINIMIZER_PLUGIN_INFO_MAPPINGS.get(
                    /** @type {{ module: Module }} */
                    (data).module,
                  )
                : undefined;

            if (info && newInfo) {
              Object.assign(info, newInfo);
            }

            return filename;
          },
        );
      });

      compiler.hooks.afterPlugins.tap({ name: pluginName }, () => {
        const { minimizer, generator, test, include, exclude, severityError } =
          this.options;

        const minimizerForLoader = minimizer;
        let generatorForLoader = generator;

        if (Array.isArray(generatorForLoader)) {
          const importGenerators = generatorForLoader.filter(
            (item) =>
              typeof item.type === "undefined" || item.type === "import",
          );

          generatorForLoader =
            importGenerators.length > 0
              ? /** @type {G extends any[] ? { [P in keyof G]: Generator<G[P]>; } : Generator<G>[]} */
                (importGenerators)
              : undefined;
        }

        if (!minimizerForLoader && !generatorForLoader) {
          return;
        }

        const loader = /** @type {InternalLoaderOptions<T>} */ ({
          test,
          include,
          exclude,
          enforce: "pre",
          loader: require.resolve(path.join(__dirname, "loader.js")),
          options:
            /** @type {import("./loader").LoaderOptions<T>} */
            ({
              generator: generatorForLoader,
              minimizer: minimizerForLoader,
              severityError,
            }),
        });
        const dataURILoader = /** @type {InternalLoaderOptions<T>} */ ({
          scheme: /^data$/,
          mimetype: /^image\/.+/i,
          enforce: "pre",
          loader: require.resolve(path.join(__dirname, "loader.js")),
          options:
            /** @type {import("./loader").LoaderOptions<T>} */
            ({
              generator: generatorForLoader,
              minimizer: minimizerForLoader,
              severityError,
            }),
        });

        compiler.options.module.rules.push(loader);
        compiler.options.module.rules.push(dataURILoader);
      });
    }

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.afterSeal.tapPromise({ name: pluginName }, async () => {
        await this.teardownAll();
      });
    });

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage:
            compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
          additionalAssets: true,
        },
        async (assets) => {
          await this.optimize(compiler, compilation, assets);
        },
      );

      compilation.hooks.statsPrinter.tap(pluginName, (stats) => {
        stats.hooks.print
          .for("asset.info.minimized")
          .tap(
            "image-minimizer-webpack-plugin",
            (minimized, { green, formatFlag }) =>
              minimized
                ? /** @type {Function} */ (green)(
                    /** @type {Function} */ (formatFlag)("minimized"),
                  )
                : "",
          );

        stats.hooks.print
          .for("asset.info.generated")
          .tap(
            "image-minimizer-webpack-plugin",
            (generated, { green, formatFlag }) =>
              generated
                ? /** @type {Function} */ (green)(
                    /** @type {Function} */ (formatFlag)("generated"),
                  )
                : "",
          );
      });
    });
  }
}

ImageMinimizerPlugin.loader = require.resolve("./loader");
ImageMinimizerPlugin.imageminNormalizeConfig = imageminNormalizeConfig;
ImageMinimizerPlugin.imageminMinify = imageminMinify;
ImageMinimizerPlugin.imageminGenerate = imageminGenerate;
ImageMinimizerPlugin.squooshMinify = squooshMinify;
ImageMinimizerPlugin.squooshGenerate = squooshGenerate;
ImageMinimizerPlugin.sharpMinify = sharpMinify;
ImageMinimizerPlugin.sharpGenerate = sharpGenerate;
ImageMinimizerPlugin.svgoMinify = svgoMinify;

module.exports = ImageMinimizerPlugin;
