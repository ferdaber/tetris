const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dev =
  process.env.NODE_ENV == null || process.env.NODE_ENV === "development";
const publicPath = "/";
const buildDir = path.resolve("dist");
const srcDir = path.resolve("src");
const staticDir = path.resolve("static");

function formatWindowsUri(path) {
  return path.replace(/\\/g, "/");
}

module.exports = /** @type {import('webpack').Configuration} */ ({
  entry: [
    path.resolve(srcDir, "polyfills.ts"),
    path.resolve(srcDir, "index.tsx"),
  ],
  output: {
    path: buildDir,
    // filename is the template for entry points
    // chunk is the template for generated (split) assets from the entry point
    // they don't really have any meaningful differences for consumers, as long as their names don't collide
    filename: dev ? "js/[name].js" : "js/[name].[chunkhash:6].js",
    chunkFilename: dev
      ? "js/[name].chunk.js"
      : "js/[name].[chunkhash:6].chunk.js",
    publicPath,
    // useful comments in dev mode about where the module was located
    pathinfo: dev,
    // the template generator for sourcemapped files' paths in browser dev tools
    devtoolModuleFilenameTemplate(info) {
      return formatWindowsUri(path.relative(srcDir, info.absoluteResourcePath));
    },
  },
  mode: dev ? "development" : "production",
  resolve: {
    mainFields: ["module", "main"],
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    // modules: ["node_modules", srcDir],
  },
  module: {
    // makes missing exports an error instead of warning
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            resource: {
              test: /\.[tj]sx?$/,
              exclude: /node_modules/,
            },
            use: [
              {
                loader: "babel-loader",
                options: {
                  extends: "./babel.config.js",
                  // emit source maps
                  sourceMaps: true,
                  // creates a cache directory (babel-loader ONLY)
                  cacheDirectory: true,
                  // minify and cache the minification step in PROD
                  compact: !dev,
                  cacheCompression: !dev,
                },
              },
              {
                loader: "linaria/loader",
                options: {
                  sourceMap: dev,
                },
              },
            ],
          },
          {
            test: /\.s?css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: "css-loader",
                options: {
                  sourceMap: dev,
                },
              },
              {
                loader: "sass-loader",
                options: {
                  sourceMap: dev,
                },
              },
            ],
          },
          {
            test: /\.(bmp|gif|jpe?g|png)$/,
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "assets/[name].[hash:6].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new (require("html-webpack-plugin"))({
      template: path.resolve(staticDir, "index.ejs"),
      // injects generated assets into head and body for css and js assets, respectively
      inject: true,
      templateParameters: {
        GIT_COMMIT: process.env.GIT_COMMIT || "unknown",
      },
      // taken from CRA's config
      minify: !dev && {
        removeComments: false,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.EnvironmentPlugin({
      GIT_COMMIT: null,
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        dev ? "development" : "production"
      ),
    }),
    // creates a map of generated assets with their filenames
    new (require("webpack-manifest-plugin"))({
      fileName: "asset-manifest.json",
      publicPath,
    }),
    // copies the static dir without index.html
    new (require("copy-webpack-plugin"))([
      {
        from: staticDir,
        to: path.resolve(buildDir, "static"),
        ignore: ["index.ejs"],
      },
    ]),
    new MiniCssExtractPlugin({
      // filename is the template for entry points
      // chunk is the template for generated (split) assets from the entry point
      // they don't really have any meaningful differences for consumers, as long as their names don't collide
      filename: dev ? "css/[name].css" : "css/[name].[chunkhash:6].css",
      chunkFilename: dev
        ? "css/[name].chunk.css"
        : "css/[name].[chunkhash:6].chunk.css",
    }),
  ],
  optimization: {
    minimize: !dev,
    minimizer: [
      // terser supports > ES5 syntax
      new (require("terser-webpack-plugin"))({
        terserOptions: {
          ecma: 2017,
          output: {
            comments: false,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
    ],
    // considers everything to be splittable, including synchronous imports from entry point graphs
    splitChunks: {
      chunks: "all",
      name: false,
    },
    // splits the runtime into its own chunk
    runtimeChunk: true,
  },
  devServer: {
    // dev server serves what is outputted into the build directory
    // it still stores everything in memory though
    writeToDisk: true,
    contentBase: buildDir,
    compress: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    port: 3000,
  },
  // always use source-map to allow CSS source maps in dev mode
  devtool: "source-map",
  performance: false,
});
