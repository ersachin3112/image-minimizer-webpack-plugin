<!--lint disable no-html-->
<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" hspace="10"
      src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon.svg">
  </a>
  <h1>Imagemin Webpack</h1>
  <p>
    A Plugin and Loader for <a href="http://webpack.js.org/">webpack</a> to optimize (compress) all images using <a href="https://github.com/imagemin/imagemin">imagemin</a>.
    Do not worry about size of images, now they are always optimized/compressed.
  </p>
</div>

<!--lint enable no-html-->

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![discussion][discussion]][discussion-url]
[![size][size]][size-url]

# image-minimizer-webpack-plugin

<!--
This Table of Contents was generated using the VS Code extension [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
with option `"markdown.extension.toc.levels": "2..6"`
-->

- [Getting Started](#getting-started)
  - [Install optimize/generate tool](#install-an-optimizationgeneration-tool)
  - [Optimize with `imagemin`](#optimize-with-imagemin)
  - [[**DEPRECATED**] Optimize with `squoosh`](#deprecated-optimize-with-squoosh)
  - [Optimize with `sharp`](#optimize-with-sharp)
  - [Optimize with `svgo`](#optimize-with-svgo)
  - [Advanced setup](#advanced-setup)
    - [Query Parameters (only `squoosh` and `sharp` currently)](#query-parameters-only-squoosh-and-sharp-currently)
    - [Standalone Loader](#standalone-loader)
    - [Standalone Plugin](#standalone-plugin)
- [Plugin Options](#plugin-options)
  - [`test`](#test)
  - [`include`](#include)
  - [`exclude`](#exclude)
  - [`minimizer`](#minimizer)
    - [Available minimizers](#available-minimizers)
    - [Single minimizer example for `imagemin`](#single-minimizer-example-for-imagemin)
    - [[**DEPRECATED**] Single minimizer example for `squoosh`](#deprecated-single-minimizer-example-for-squoosh)
    - [Single minimizer example for `sharp`](#single-minimizer-example-for-sharp)
    - [Single minimizer example for user defined implementation](#single-minimizer-example-for-user-defined-implementation)
    - [Multiple minimizers example](#multiple-minimizers-example)
    - [Minimizer options](#minimizer-options)
      - [`implementation`](#implementation)
      - [`options`](#options)
      - [`filter`](#filter)
      - [`filename`](#filename)
  - [`generator`](#generator)
    - [Available generators](#available-generators)
    - [Generator example for `imagemin`](#generator-example-for-imagemin)
    - [[**DEPRECATED**] Generator example for `squoosh`](#deprecated-generator-example-for-squoosh)
    - [Generator example for `sharp`](#generator-example-for-sharp)
    - [Generator example for user defined implementation](#generator-example-for-user-defined-implementation)
    - [Generator options](#generator-options)
      - [`type`](#type)
      - [`preset`](#preset)
      - [`implementation`](#implementation-1)
      - [`options`](#options-1)
      - [`filter`](#filter-1)
      - [`filename`](#filename-1)
  - [`severityError`](#severityerror)
  - [`loader`](#loader)
  - [`concurrency`](#concurrency)
  - [`deleteOriginalAssets`](#deleteoriginalassets)
- [Loader Options](#loader-options)
  - [`minimizer`](#minimizer-1)
    - [Loader minimizer example for `imagemin`](#loader-minimizer-example-for-imagemin)
  - [`generator`](#generator-1)
    - [Loader generator example for `imagemin`](#loader-generator-example-for-imagemin)
  - [`severityError`](#severityerror-1)
- [Additional API](#additional-api)
  - [`imageminNormalizeConfig(config)`](#imageminnormalizeconfigconfig)
- [Examples](#examples)
  - [Optimize images based on size](#optimize-images-based-on-size)
  - [Optimize and generate `webp` images](#optimize-and-generate-webp-images)
  - [Generate `webp` images from copied assets](#generate-webp-images-from-copied-assets)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

This plugin can use four different tools to optimize or generate images:

- [`imagemin`](https://github.com/imagemin/imagemin) - Optimize your images by default, since it is stable and works with all types of images
- **DEPRECATED** [`squoosh`](https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh) - while working in experimental mode with `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` file types.
- [`sharp`](https://github.com/lovell/sharp) - High performance Node.js image processing, the fastest module to resize and compress JPEG, PNG, WebP, AVIF and TIFF images. Uses the libvips library.
- [`svgo`](https://github.com/svg/svgo) - tool for optimizing SVG vector graphics files. Supports only SVG files minification.

> [!WARNING]
>
> By default, we don’t install any additional packages.

### Install an Optimization/Generation Tool

To begin, you'll need to install `image-minimizer-webpack-plugin` along with an image optimizer or generator:

- [`imagemin`](https://github.com/imagemin/imagemin):

```console
npm install image-minimizer-webpack-plugin imagemin --save-dev
```

> [!WARNING]
>
> imagemin uses plugins to optimize or generate images, so you’ll need to install those as well.

- **DEPRECATED** [`squoosh`](https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh):

```console
npm install image-minimizer-webpack-plugin @squoosh/lib --save-dev
```

- [`sharp`](https://github.com/lovell/sharp):

```console
npm install image-minimizer-webpack-plugin sharp --save-dev
```

- [`svgo`](https://github.com/svg/svgo):

```console
npm install image-minimizer-webpack-plugin svgo --save-dev
```

Images can be optimized in two modes:

1.  [Lossless](https://en.wikipedia.org/wiki/Lossless_compression) (without loss of quality).
2.  [Lossy](https://en.wikipedia.org/wiki/Lossy_compression) (with some loss of quality).

### Optimize with [`imagemin`](https://github.com/imagemin/imagemin)

> [!NOTE]
>
> - [imagemin-mozjpeg](https://github.com/imagemin/imagemin-mozjpeg) can be configured in lossless and lossy mode.
> - [imagemin-svgo](https://github.com/imagemin/imagemin-svgo) can be configured in lossless and lossy mode.

Explore the available options to find the best results for your use case.

**Recommended `imagemin` plugins for lossless optimization**

```shell
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo --save-dev
```

**Recommended `imagemin` plugins for lossy optimization**

```shell
npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo --save-dev
```

For `imagemin-svgo` v9.0.0+, you need to use the official [SVGO configuration](https://github.com/svg/svgo#configuration)

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
      },
    ],
  },
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better results
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // SVGO configuration here https://github.com/svg/svgo#configuration
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
};
```

### **DEPRECATED** Optimize with [`squoosh`](https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh)

```console
npm install @squoosh/lib --save-dev
```

**Recommended `@squoosh/lib` options for lossy optimization**

For lossy optimization, we recommend using the default settings of `@squoosh/lib` package.
The default values and supported file types for each option can be found in the [codecs.ts](https://github.com/GoogleChromeLabs/squoosh/blob/dev/libsquoosh/src/codecs.ts) file under `codecs` directory.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      // You need this, if you are using `import file from "file.ext"`; not needed for `new URL(...)` syntax
      {
        test: /\.(jpe?g|png)$/i,
        type: "asset",
      },
    ],
  },
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
          options: {
            // Your options for `squoosh` here
          },
        },
      }),
    ],
  },
};
```

**Recommended `squoosh` options for lossless optimization**

For lossless optimization we recommend using the options listed below in `minimizer.options.encodeOptions`.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      // You need this, if you are using `import file from "file.ext"`, for `new URL(...)` syntax you don't need it
      {
        test: /\.(jpe?g|png)$/i,
        type: "asset",
      },
    ],
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
          options: {
            encodeOptions: {
              mozjpeg: {
                // That setting might be close to lossless, but it’s not guaranteed
                // See https://github.com/GoogleChromeLabs/squoosh/issues/85
                quality: 100,
              },
              webp: {
                lossless: 1,
              },
              avif: {
                // See https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/avif/enc/README.md
                cqLevel: 0,
              },
            },
          },
        },
      }),
    ],
  },
};
```

### Optimize with [`sharp`](https://github.com/lovell/sharp)

```console
npm install sharp --save-dev
```

**Recommended `sharp` options for lossy optimization**

For lossy optimization we recommend using the default settings of `sharp` package.
The default values and supported file types for each option can be found in the [sharp documentation](https://sharp.pixelplumbing.com/api-output).

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      // You need this, if you are using `import file from "file.ext"`, for `new URL(...)` syntax you don't need it
      {
        test: /\.(jpe?g|png)$/i,
        type: "asset",
      },
    ],
  },
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              // Customize your `sharp` options here
              // See https://sharp.pixelplumbing.com/api-output
            },
          },
        },
      }),
    ],
  },
};
```

**Recommended `sharp` options for lossless optimization**

For lossless optimization we recommend using the options listed below in `minimizer.options.encodeOptions`.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      // You need this, if you are using `import file from "file.ext"`. Not needed for `new URL(...)` syntax
      {
        test: /\.(jpe?g|png)$/i,
        type: "asset",
      },
    ],
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: {
                // https://sharp.pixelplumbing.com/api-output#jpeg
                quality: 100,
              },
              webp: {
                // https://sharp.pixelplumbing.com/api-output#webp
                lossless: true,
              },
              avif: {
                // https://sharp.pixelplumbing.com/api-output#avif
                lossless: true,
              },

              // PNG by default sets the quality to 100%, which is same as lossless
              // https://sharp.pixelplumbing.com/api-output#png
              png: {},

              // GIF does not support lossless compression at all
              // https://sharp.pixelplumbing.com/api-output#gif
              gif: {},
            },
          },
        },
      }),
    ],
  },
};
```

### Optimize with [`svgo`](https://github.com/svg/svgo)

```console
npm install svgo --save-dev
```

**Recommended `svgo` options for optimization**

For SVG optimization we recommend using the options listed below in `minimizer.options.encodeOptions`.
The default values for plugins can be found in the [svgo plugins source code](https://github.com/svg/svgo/tree/main/plugins).

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      // You need this, if you are using `import file from "file.ext"`. Not needed for `new URL(...)` syntax
      {
        test: /\.(svg)$/i,
        type: "asset",
      },
    ],
  },
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.svgoMinify,
          options: {
            encodeOptions: {
              // Pass over SVGs multiple times to ensure all optimizations are applied (False by default)
              multipass: true,
              plugins: [
                // Built-in plugin preset enabled by default
                // See: https://github.com/svg/svgo#default-preset
                "preset-default",
              ],
            },
          },
        },
      }),
    ],
  },
};
```

### Advanced setup

- If you want to use `loader` or `plugin` standalone see sections below, but this is **not recommended**.

- By default, plugin configures `loader` (please use the `loader` option if you want to disable this behaviour), therefore you should not setup standalone loader when you use a plugin setup.

- Loader optimizes or generates images using options, so inlined images via `data` URI (i.e. `data:`) will be optimized or generated too, non-inlined images will be optimized too.

#### Query Parameters (only `squoosh` and `sharp` currently)

The plugin supports the following query parameters:

- `width`/`w` - allows you to set the image width
- `height`/`h` - allows you to set the image height
- `as` - to specify the [preset](#preset) option

  **Only supported for `sharp` currently:**

- `unit`/`u` - can be `px` or `percent` and allows you to resize by a percentage of the image's size.

Examples:

```js
const myImage1 = new URL("image.png?width=150&height=120", import.meta.url);
const myImage2 = new URL("image.png?w=150&h=120", import.meta.url);
// You can omit one of the parameters to auto-scale
const myImage3 = new URL("image.png?w=150", import.meta.url);
// It works with the `preset` query parameter
const myImage4 = new URL("image.png?as=webp&w=150&h=120", import.meta.url);
// You can use `auto` to reset `width` or `height` from the `preset` option
const myImage5 = new URL("image.png?as=webp&w=150&h=auto", import.meta.url);
// You can use `unit` to get the non-retina resize of images that are retina sized
const myImage6 = new URL("image.png?width=50&unit=percent", import.meta.url);
```

```css
.class {
  background: url("./image.png?width=150&height=120");
}
```

```html
<picture>
  <source srcset="photo.jpg?as=avif&width=150&height=120" type="image/avif" />
  <source srcset="photo.jpg?as=webp&width=150&height=120" type="image/webp" />
  <img src="photo.jpg?width=150&height=120" alt="photo" />
</picture>
```

> [!NOTE]
>
> You need to setup `avif` and `webp` presets, See the [example for webp](#optimize-and-generate-webp-images).

#### Standalone Loader

[Documentation: Using loaders](https://webpack.js.org/concepts/loaders/).

In your `webpack.config.js`, add the `ImageMinimizerPlugin.loader` and specify the [asset modules options](https://webpack.js.org/guides/asset-modules/) (if you use images in `import`):

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      // You need this, if you are using `import file from "file.ext"`. Not needed for `new URL(...)` syntax
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
      },
      // We recommend using only for the "production" mode
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        enforce: "pre",
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                  plugins: [
                    "imagemin-gifsicle",
                    "imagemin-mozjpeg",
                    "imagemin-pngquant",
                    "imagemin-svgo",
                  ],
                },
              },
            },
          },
        ],
      },
    ],
  },
};
```

#### Standalone Plugin

[Documentation: Using plugins](https://webpack.js.org/concepts/plugins/).

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      // You need this, if you are using `import file from "file.ext"`. Not needed for `new URL(...)` syntax
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
      },
    ],
  },
  optimization: {
    minimizer: [
      // Extend default minimizer, i.e. `terser-webpack-plugin` for JS
      "...",
      // We recommend using only for the "production" mode
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
        loader: false, // Disable the `loader`
      }),
    ],
  },
};
```

## Plugin Options

- **[`test`](#test)**
- **[`include`](#include)**
- **[`exclude`](#exclude)**
- **[`minimizer`](#minimizer)**
- **[`generator`](#generator)**
- **[`severityError`](#severityerror)**
- **[`loader`](#loader)**
- **[`concurrency`](#concurrency)**
- **[`deleteOriginalAssets`](#deleteoriginalassets)**

### `test`

Type:

```ts
type test = string | RegExp | Array<string | RegExp>;
```

Default: `/\.(jpe?g\|png\|gif\|tif\|webp\|svg\|avif)\$/i`

Test to match files against.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
      }),
    ],
  },
};
```

### `include`

Type:

```ts
type include = string | RegExp | Array<string | RegExp>;
```

Default: `undefined`

Files to include.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        include: /\/includes/,
      }),
    ],
  },
};
```

### `exclude`

Type:

```ts
type exclude = string | RegExp | Array<string | RegExp>;
```

Default: `undefined`

Files to exclude.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        exclude: /\/excludes/,
      }),
    ],
  },
};
```

### `minimizer`

Type:

```ts
type minimizer =
  | {
      implementation: (
        original: {
          filename: string;
          data: Buffer;
          warnings: Array<Error>;
          errors: Array<Error>;
          info: import("webpack").AssetInfo;
        },
        options?:
          | {
              [key: string]: any;
            }
          | undefined,
      ) => Promise<{
        filename: string;
        data: Buffer;
        warnings: Array<Error>;
        errors: Array<Error>;
        info: import("webpack").AssetInfo;
      }> & {
        setup?: (() => void) | undefined;
        teardown?: (() => void) | undefined;
      };
      options?:
        | {
            [key: string]: any;
          }
        | undefined;
      filter?: (source: Buffer, sourcePath: string) => boolean | undefined;
      filename?:
        | string
        | ((
            pathData: {
              filename?: string | undefined;
            },
            assetInfo?: import("webpack").AssetInfo | undefined,
          ) => string)
        | undefined;
    }
  | Array<{
      implementation: (
        original: {
          filename: string;
          data: Buffer;
          warnings: Array<Error>;
          errors: Array<Error>;
          info: import("webpack").AssetInfo;
        },
        options?:
          | {
              [key: string]: any;
            }
          | undefined,
      ) => Promise<{
        filename: string;
        data: Buffer;
        warnings: Array<Error>;
        errors: Array<Error>;
        info: import("webpack").AssetInfo;
      }> & {
        setup?: (() => void) | undefined;
        teardown?: (() => void) | undefined;
      };
      options?:
        | {
            [key: string]: any;
          }
        | undefined;
      filter?: (source: Buffer, sourcePath: string) => boolean | undefined;
      filename?:
        | string
        | ((
            pathData: {
              filename?: string | undefined;
            },
            assetInfo?: import("webpack").AssetInfo | undefined,
          ) => string)
        | undefined;
    }>;
```

Default: `undefined`

Allows to setup default minify function.

#### Available minimizers

- `ImageMinimizerPlugin.imageminMinify`
- **DEPRECATED** `ImageMinimizerPlugin.squooshMinify`
- `ImageMinimizerPlugin.sharpMinify`
- `ImageMinimizerPlugin.svgoMinify`

#### Single minimizer example for `imagemin`

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          // Implementation
          implementation: ImageMinimizerPlugin.imageminMinify,
          // Options
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
      }),
    ],
  },
};
```

More information and examples [here](https://github.com/imagemin/imagemin).

#### **DEPRECATED** Single minimizer example for `squoosh`

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          // Implementation
          implementation: ImageMinimizerPlugin.squooshMinify,
          // Options
          options: {
            encodeOptions: {
              mozjpeg: {
                quality: 90,
              },
            },
          },
        },
      }),
    ],
  },
};
```

More information and examples [here](https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh).

#### Single minimizer example for `sharp`

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          // Implementation
          implementation: ImageMinimizerPlugin.sharpMinify,
          // Options
          options: {
            encodeOptions: {
              jpeg: {
                quality: 90,
              },
            },
          },
        },
      }),
    ],
  },
};
```

More information and examples [here](https://sharp.pixelplumbing.com/api-output#toformat).

#### Single minimizer example for user defined implementation

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: async (original, options) => {
            const inputExt = path.extname(original.filename).toLowerCase();

            if (inputExt !== ".xxx") {
              // Return `null` if the implementation does not support this file type
              return null;
            }

            let result;

            try {
              result = await minifyAndReturnBuffer(original.data);
            } catch (error) {
              // Store error and return `null` if there was an error
              original.errors.push(error);
              return null;
            }

            return {
              filename: original.filename,
              data: result,
              warnings: [...original.warnings],
              errors: [...original.errors],
              info: {
                ...original.info,
                // Please always set it to prevent double minification
                minimized: true,
                // Optional
                minimizedBy: ["custom-name-of-minimication"],
              },
            };
          },
          options: {
            // Custom options
          },
        },
      }),
    ],
  },
};
```

#### Multiple minimizers example

Allows to setup multiple minimizers.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: [
          {
            // `sharp` will handle all bitmap formats (JPG, PNG, GIF, ...)
            implementation: ImageMinimizerPlugin.sharpMinify,

            // exclude SVG if implementation support it. Not required for `sharp`.
            // filter: (source, sourcePath) => !(/\.(svg)$/i.test(sourcePath)),

            options: {
              encodeOptions: {
                // Your options for `sharp`
                // https://sharp.pixelplumbing.com/api-output
              },
            },
          },
          {
            // `svgo` will handle vector images (SVG)
            implementation: ImageMinimizerPlugin.svgoMinify,
            options: {
              encodeOptions: {
                // Pass over SVGs multiple times to ensure all optimizations are applied. False by default
                multipass: true,
                plugins: [
                  // set of built-in plugins enabled by default
                  // see: https://github.com/svg/svgo#default-preset
                  "preset-default",
                ],
              },
            },
          },
        ],
      }),
    ],
  },
};
```

#### Minimizer options

##### `implementation`

Type:

```ts
type implementation = (
  original: {
    filename: string;
    data: Buffer;
    warnings: Array<Error>;
    errors: Array<Error>;
    info: import("webpack").AssetInfo;
  },
  options?: BasicTransformerOptions<T>,
) => Promise<{
  filename: string;
  data: Buffer;
  warnings: Array<Error>;
  errors: Array<Error>;
  info: import("webpack").AssetInfo;
}> & {
  setup?: (() => void) | undefined;
  teardown?: (() => void) | undefined;
};
```

Default: `undefined`

Configure the default `implementation`.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          // Implementation
          implementation: ImageMinimizerPlugin.sharpMinify,
          // Options
          options: {
            encodeOptions: {
              jpeg: {
                quality: 90,
              },
            },
          },
        },
      }),
    ],
  },
};
```

##### `options`

Type:

```ts
type options = {
  [key: string]: any;
};
```

Default: `undefined`

Options for the `implementation` option (i.e. options for `imagemin`/`squoosh`/`sharp`/custom implementation).

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          // Options
          options: {
            encodeOptions: {
              jpeg: {
                quality: 90,
              },
            },
          },
        },
      }),
    ],
  },
};
```

##### `filter`

Type:

```ts
type filter = (source: Buffer, sourcePath: string) => boolean | undefined;
```

Default: `() => true`

Allows filtering of images for optimization or generation.

Return `true` to process (optimize or generate) the image, or `false` to skip it.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          filter: (source, sourcePath) => {
            // The `source` argument is a `Buffer` of source file
            // The `sourcePath` argument is an absolute path to source
            if (source.byteLength < 8192) {
              return false;
            }

            return true;
          },
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
      }),
    ],
  },
};
```

##### `filename`

Type:

```ts
type filename =
  | string
  | ((
      pathData: {
        filename?: string | undefined;
      },
      assetInfo?: import("webpack").AssetInfo | undefined,
    ) => string)
  | undefined;
```

Default: `undefined`

Allows to set the filename.
Supported values see in [`webpack template strings`](https://webpack.js.org/configuration/output/#template-strings) (see the `File-level` section for supported patterns).

We also support `[width]` and `[height]` placeholders (only when using `sharp` and `squoosh`).

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          filename: "optimized-[name][ext]",
          implementation: ImageMinimizerPlugin.sharpMinify,
          // Options
          options: {
            encodeOptions: {
              jpeg: {
                quality: 90,
              },
            },
          },
        },
      }),
    ],
  },
};
```

Example `function` usage:

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          filename: () => "optimized-[name][ext]",
          implementation: ImageMinimizerPlugin.sharpMinify,
          // Options
          options: {
            encodeOptions: {
              jpeg: {
                quality: 90,
              },
            },
          },
        },
      }),
    ],
  },
};
```

### `generator`

Type:

```ts
type generator = Array<{
  implementation: (
    original: {
      filename: string;
      data: Buffer;
      warnings: Array<Error>;
      errors: Array<Error>;
      info: import("webpack").AssetInfo;
    },
    options?:
      | {
          [key: string]: any;
        }
      | undefined,
  ) => Promise<{
    filename: string;
    data: Buffer;
    warnings: Array<Error>;
    errors: Array<Error>;
    info: import("webpack").AssetInfo;
  }> & {
    setup?: (() => void) | undefined;
    teardown?: (() => void) | undefined;
  };
  options?:
    | {
        [key: string]: any;
      }
    | undefined;
  filter?: (source: Buffer, sourcePath: string) => boolean | undefined;
  filename?:
    | string
    | ((
        pathData: {
          filename?: string | undefined;
        },
        assetInfo?: import("webpack").AssetInfo | undefined,
      ) => string)
    | undefined;
  preset?: string | undefined;
  type?: "import" | "asset" | undefined;
}>;
```

Default: `undefined`

Allow to setup default image generators.
This is useful when you want to generate additional formats like `webp`, `avif`, etc., from the original images.

> [!WARNING]
>
> If no generator was found for the image (i.e. no `?as=webp` was found in query params), the `minimizer` option will be used.
> Therefore, it is recommended to configure generator outputs optimized image.

> [!WARNING]
>
> The option will not work if you disable the `loader` (i.e. set the `loader` option to `false`).

#### Available generators

- `ImageMinimizerPlugin.imageminGenerate`
- **DEPRECATED** `ImageMinimizerPlugin.squooshGenerate`
- `ImageMinimizerPlugin.sharpGenerate`

#### Generator example for `imagemin`

Example `webp` generator:

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            // You can apply generator using `?as=webp`
            // You can use any name and provide more options
            preset: "webp",
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              // Please specify only one plugin here, multiple plugins will not work
              plugins: ["imagemin-webp"],
            },
          },
        ],
      }),
    ],
  },
};
```

#### **DEPRECATED** Generator example for `squoosh`

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            // You can apply generator using `?as=webp`, you can use any name and provide more options
            preset: "webp",
            implementation: ImageMinimizerPlugin.squooshGenerate,
            options: {
              encodeOptions: {
                // Please specify only one codec here, multiple codecs will not work
                webp: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

#### Generator example for `sharp`

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            // You can apply generator using `?as=webp`, you can use any name and provide more options
            preset: "webp",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                // Please specify only one codec here, multiple codecs will not work
                webp: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

Now you can generate the new image using:

```js
// Old approach for getting URL
import webp from "./file.jpg?as=webp";

// Assets modules
console.log(new URL("./file.jpg?as=webp"));
```

```css
div {
  background: url("./file.jpg?as=webp");
}
```

You can use `?as=webp` in any type of files.

Example multiple generators:

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            // You can apply generator using `?as=webp`, you can use any name and provide more options
            preset: "webp",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  lossless: false,
                },
              },
            },
          },
          {
            // You can apply generator using `?as=avif`, you can use any name and provide more options
            preset: "avif",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                avif: {
                  lossless: false,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

`squoosh` and `sharp` generator supports more options, for example you can resize an image:

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            // You can apply generator using `?as=webp-100-50`, you can use any name and provide more options
            preset: "webp-100-50",
            // implementation: ImageMinimizerPlugin.squooshGenerate,
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              resize: {
                enabled: true,
                width: 100,
                height: 50,
              },
              encodeOptions: {
                webp: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

You can find more information in the [squoosh GitHub repository](https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh).

For only `sharp` currently, you can even generate the non-retina resizes of images:

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            // You can apply generator using `?as=webp-1x`, you can use any name and provide more options
            preset: "webp-1x",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              resize: {
                enabled: true,
                width: 50,
                unit: "percent",
              },
              encodeOptions: {
                webp: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

#### Generator example for user defined implementation

You can use your own generator implementation.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            // You can apply generator using `?as=webp`, you can use any name and provide more options
            preset: "webp",
            implementation: async (original, options) => {
              const inputExt = path.extname(original.filename).toLowerCase();

              if (inputExt !== ".xxx") {
                // Store error and return `null` if the implementation does not support this file type
                original.errors.push(error);
                return null;
              }

              let result;

              try {
                result = await minifyAndReturnBuffer(original.data);
              } catch (error) {
                // Store error and return `null` if there was an error
                original.errors.push(error);
                return null;
              }

              return {
                filename: original.filename,
                data: result,
                warnings: [...original.warnings],
                errors: [...original.errors],
                info: {
                  ...original.info,
                  // Please always set it to prevent double minification
                  generated: true,
                  // Optional
                  generatedBy: ["custom-name-of-minification"],
                },
              };
            },
            options: {
              // Your options
            },
          },
        ],
      }),
    ],
  },
};
```

#### Generator options

##### `type`

Type:

```ts
type type = "import" | "asset" | undefined;
```

Default: `"import"`

Allows you to apply the generator for either `import` or `assets` from compilation (useful for copied assets).
By default, generators are applying on `import`/`require`, but sometimes you need to generate new images from other plugins (for example - `copy-webpack-plugin`).
If you need this, please set `asset` value for the `type` option.

**webpack.config.js**

```js
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
        generator: [
          {
            // Apply generator for copied assets
            type: "asset",
            // You can use `ImageMinimizerPlugin.squooshGenerate`
            // You can use `ImageMinimizerPlugin.sharpGenerate`
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ["imagemin-webp"],
            },
          },
        ],
      }),
    ],
  },
  plugins: [new CopyPlugin({ patterns: ["images/**/*.png"] })],
};
```

##### `preset`

Type:

```ts
type preset = string | undefined;
```

Default: `undefined`

Configures the name of preset, i.e. you can use it in `?as=name`.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: "name",
            // Implementation
            implementation: ImageMinimizerPlugin.sharpMinify,
            options: {
              encodeOptions: {
                jpeg: {
                  quality: 85,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

##### `implementation`

Type:

```ts
type implementation = (
  original: {
    filename: string;
    data: Buffer;
    warnings: Array<Error>;
    errors: Array<Error>;
    info: import("webpack").AssetInfo;
  },
  options?:
    | {
        [key: string]: any;
      }
    | undefined,
) => Promise<{
  filename: string;
  data: Buffer;
  warnings: Array<Error>;
  errors: Array<Error>;
  info: import("webpack").AssetInfo;
}> & {
  setup?: (() => void) | undefined;
  teardown?: (() => void) | undefined;
};
```

Default: `undefined`

Configures the default `implementation`.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: "name",
            // Implementation
            implementation: ImageMinimizerPlugin.sharpMinify,
            options: {
              encodeOptions: {
                jpeg: {
                  quality: 85,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

##### `options`

Type:

```ts
type options = {
  [key: string]: any;
};
```

Default: `undefined`

Options for the `implementation` (i.e. options for `imagemin`/`squoosh`/`sharp`/custom implementation).

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: "name",
            implementation: ImageMinimizerPlugin.sharpMinify,
            // Options
            options: {
              encodeOptions: {
                jpeg: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

##### `filter`

Type:

```ts
type filter = (source: Buffer, sourcePath: string) => boolean;
```

Default: `() => true`

Allows filtering of images for optimization/generation.

Return `true` to optimize the image, or `false` to skip it.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: "name",
            filter: (source, sourcePath) => {
              // The `source` argument is a `Buffer` of the source file
              // The `sourcePath` argument is an absolute path to the source
              if (source.byteLength < 8192) {
                return false;
              }

              return true;
            },
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                "imagemin-gifsicle",
                "imagemin-mozjpeg",
                "imagemin-pngquant",
                "imagemin-svgo",
              ],
            },
          },
        ],
      }),
    ],
  },
};
```

##### `filename`

Type:

```ts
type filename =
  | string
  | ((
      pathData: PathData,
      assetInfo?: import("webpack").AssetInfo | undefined,
    ) => string);
```

Default: `undefined`

Allows to set the filename.
Supported values see in [`webpack template strings`](https://webpack.js.org/configuration/output/#template-strings), under the `File-level` section.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: "name",
            filename: "generated-[name][ext]",
            implementation: ImageMinimizerPlugin.sharpMinify,
            // Options
            options: {
              encodeOptions: {
                jpeg: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

Example of `function` usage:

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: "name",
            filename: () => "generated-[name][ext]",
            implementation: ImageMinimizerPlugin.sharpMinify,
            // Options
            options: {
              encodeOptions: {
                jpeg: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

### `severityError`

Type:

```ts
type severityError = string;
```

Default: `'error'`

Allows to choose how errors are displayed during image optimization.

Сan have the following values:

- `'off'` - Suppresses both errors and warnings
- `'warning'` - Emits warnings instead of errors
- `'error'` - Emits errors

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        severityError: "warning",
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
      }),
    ],
  },
};
```

### `loader`

Type:

```ts
type loader = boolean;
```

Default: `true`

Automatically adding built-in `loader`, used to optimize/generate images.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        loader: false,
        // `generator` will not work in this case
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
      }),
    ],
  },
};
```

### `concurrency`

Type:

```ts
type concurrency = number;
```

Default: `Math.max(1, os.cpus().length - 1)`

Maximum number of concurrency optimization processes in one time.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        concurrency: 3,
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
      }),
    ],
  },
};
```

### `deleteOriginalAssets`

Type:

```ts
type deleteOriginalAssets = boolean;
```

Default: `true`

Allows removing original assets after optimization.

**Please use this option if you are set the `filename` option for the `minimizer` option, disable `loader: false` and want to keep optimized and not optimized assets.**

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        // Disable loader
        loader: false,
        // Allows to keep original asset and minimized assets with different filenames
        deleteOriginalAssets: false,
        minimizer: {
          filename: "[path][name].webp",
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
      }),
    ],
  },
};
```

## Loader Options

- **[`minimizer`](#minimizer-1)**
- **[`generator`](#generator-1)**
- **[`severityError`](severityerror-1)**

### `minimizer`

Type:

```ts
type minimizer =
  | {
      implementation: (
        original: {
          filename: string;
          data: Buffer;
          warnings: Array<Error>;
          errors: Array<Error>;
          info: import("webpack").AssetInfo;
        },
        options?:
          | {
              [key: string]: any;
            }
          | undefined,
      ) => Promise<{
        filename: string;
        data: Buffer;
        warnings: Array<Error>;
        errors: Array<Error>;
        info: import("webpack").AssetInfo;
      }> & {
        setup?: (() => void) | undefined;
        teardown?: (() => void) | undefined;
      };
      options?:
        | {
            [key: string]: any;
          }
        | undefined;
      filter?: (source: Buffer, sourcePath: string) => boolean | undefined;
      filename?:
        | string
        | ((
            pathData: {
              filename?: string | undefined;
            },
            assetInfo?: import("webpack").AssetInfo | undefined,
          ) => string)
        | undefined;
    }
  | Array<{
      implementation: (
        original: {
          filename: string;
          data: Buffer;
          warnings: Array<Error>;
          errors: Array<Error>;
          info: import("webpack").AssetInfo;
        },
        options?:
          | {
              [key: string]: any;
            }
          | undefined,
      ) => Promise<{
        filename: string;
        data: Buffer;
        warnings: Array<Error>;
        errors: Array<Error>;
        info: import("webpack").AssetInfo;
      }> & {
        setup?: (() => void) | undefined;
        teardown?: (() => void) | undefined;
      };
      options?:
        | {
            [key: string]: any;
          }
        | undefined;
      filter?: (source: Buffer, sourcePath: string) => boolean | undefined;
      filename?:
        | string
        | ((
            pathData: {
              filename?: string | undefined;
            },
            assetInfo?: import("webpack").AssetInfo | undefined,
          ) => string)
        | undefined;
    }>;
```

Default: `undefined`

Allows to setup default minimizer.

You can use either a single minimizer object or an array of them.

#### Loader minimizer example for `imagemin`

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: ImageMinimizerPlugin.loader,
        enforce: "pre",
        options: {
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                "imagemin-gifsicle",
                "imagemin-mozjpeg",
                "imagemin-pngquant",
                "imagemin-svgo",
              ],
            },
          },
        },
      },
    ],
  },
};
```

For more information and supported options please read [here](#minimizer).

### `generator`

Type:

```ts
type generator = Array<{
  implementation: TransformerFunction<T>;
  options?: BasicTransformerOptions<T>;
  filter?: FilterFn | undefined;
  filename?: string | FilenameFn | undefined;
  preset?: string | undefined;
  type?: "import" | "asset" | undefined;
}>;
```

Default: `undefined`

Allow to setup default generators.
This is useful for creating new image formats (e.g., webp, avif, etc.) from existing images.

#### Loader generator example for `imagemin`

The following example demonstrates how to configure a generator that converts images to the webp format using imagemin.

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: ImageMinimizerPlugin.loader,
        enforce: "pre",
        options: {
          generator: [
            {
              preset: "webp",
              implementation: ImageMinimizerPlugin.imageminGenerate,
              options: {
                plugins: ["imagemin-webp"],
              },
            },
          ],
        },
      },
    ],
  },
};
```

This setup will automatically generate .webp versions of the original assets during the build process.
For more information and supported options please read [here](#generator).

### `severityError`

Type:

```ts
type severityError = string;
```

Default: `'error'`

Allows to choose how errors are displayed during image optimization.

Сan have the following values:

- `'off'` - Suppresses errors and warnings
- `'warning'` - Emits warnings instead errors
- `'error'` - Emits errors

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              severityError: "warning",
              minimizerOptions: {
                plugins: ["gifsicle"],
              },
            },
          },
        ],
      },
    ],
  },
};
```

## Additional API

### `imageminNormalizeConfig(config)`

The function normalizes configuration (converts plugins names and options to `Function`s) for using in `imagemin` package directly.

```js
const imagemin = require("imagemin");
const { imageminNormalizeConfig } = require("image-minimizer-webpack-plugin");

/*
  console.log(imageminConfig);
  =>
  {
    plugins: [Function, Function],
    pluginsMeta: [
      { name: "imagemin-jpegtran", version: "x.x.x", options: {} },
      { name: "imagemin-pngquant", version: "x.x.x", options: { quality: [0.6, 0.8] }
    ]
  }
*/

(async () => {
  const imageminConfig = await imageminNormalizeConfig({
    plugins: ["jpegtran", ["pngquant", { quality: [0.6, 0.8] }]],
  });
  const files = await imagemin(["images/*.{jpg,png}"], {
    destination: "build/images",
    plugins: imageminConfig.plugins,
  });

  console.log(files);
  // => [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
})();
```

## Examples

### Optimize images based on size

You can use difference options (like `progressive`/`interlaced`/etc.) based on image size (example - don't do progressive transformation for small images).

What is `progressive` image? [`Answer here`](https://jmperezperez.com/medium-image-progressive-loading-placeholder/).

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [["jpegtran", { progressive: true }]],
          },
          // Only apply this one to files equal to or over 8192 bytes
          filter: (source) => {
            if (source.byteLength >= 8192) {
              return true;
            }

            return false;
          },
        },
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [["jpegtran", { progressive: false }]],
          },
          // Only apply this one to files under 8192
          filter: (source) => {
            if (source.byteLength < 8192) {
              return true;
            }

            return false;
          },
        },
      }),
    ],
  },
};
```

### Optimize and generate `webp` images

You can generate modern image formats like `webp` alongside optimized originals using the `generator` option.

- imagemin

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
        generator: [
          {
            // You can apply generator using `?as=webp`, you can use any name and provide more options
            preset: "webp",
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ["imagemin-webp"],
            },
          },
        ],
      }),
    ],
  },
};
```

- **DEPRECATED** squoosh

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
        },
        generator: [
          {
            // You can apply generator using `?as=webp`, you can use any name and provide more options
            preset: "webp",
            implementation: ImageMinimizerPlugin.squooshGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

- sharp

**webpack.config.js**

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
        },
        generator: [
          {
            // You can apply generator using `?as=webp`, you can use any name and provide more options
            preset: "webp",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
};
```

### Generate `webp` images from copied assets

You can use the generator feature to create modern image formats (like `webp`) from static assets copied using `copy-webpack-plugin`.

- imagemin

**webpack.config.js**

```js
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
        generator: [
          {
            type: "asset",
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ["imagemin-webp"],
            },
          },
        ],
      }),
    ],
  },
  plugins: [new CopyPlugin({ patterns: ["images/**/*.png"] })],
};
```

- **DEPRECATED** squoosh

**webpack.config.js**

```js
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
        },
        generator: [
          {
            type: "asset",
            implementation: ImageMinimizerPlugin.squooshGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
  plugins: [new CopyPlugin({ patterns: ["images/**/*.png"] })],
};
```

- sharp

**webpack.config.js**

```js
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
        },
        generator: [
          {
            type: "asset",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
  plugins: [new CopyPlugin({ patterns: ["images/**/*.png"] })],
};
```

## Contributing

We welcome contributions!
If you’re interested in helping improve this plugin, please take a moment to read our contributing guidelines.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/image-minimizer-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/image-minimizer-webpack-plugin
[node]: https://img.shields.io/node/v/image-minimizer-webpack-plugin.svg
[node-url]: https://nodejs.org
[tests]: https://github.com/webpack-contrib/image-minimizer-webpack-plugin/workflows/image-minimizer-webpack-plugin/badge.svg
[tests-url]: https://github.com/webpack-contrib/image-minimizer-webpack-plugin/actions
[cover]: https://codecov.io/gh/webpack-contrib/image-minimizer-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/image-minimizer-webpack-plugin
[discussion]: https://img.shields.io/github/discussions/webpack/webpack
[discussion-url]: https://github.com/webpack/webpack/discussions
[size]: https://packagephobia.now.sh/badge?p=image-minimizer-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=image-minimizer-webpack-plugin
