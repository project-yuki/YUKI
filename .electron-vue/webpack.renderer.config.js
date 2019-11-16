"use strict";

process.env.BABEL_ENV = "renderer";

const path = require("path");
const { dependencies } = require("../package.json");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
let whiteListedModules = ["vue", "vuetify", "vuetify-dialog"];

let rendererConfig = {
  optimization: {
    minimize: false
  },
  mode: process.env.NODE_ENV,
  devtool: "#cheap-module-eval-source-map",
  entry: {
    renderer: path.join(__dirname, "../src/renderer/main.ts")
  },
  externals: [
    ...Object.keys(dependencies || {}).filter(
      d => !whiteListedModules.includes(d)
    )
  ],
  module: {
    rules: [
      {
        test: /\.s(c|a)ss$/,
        use: [
          "thread-loader",
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            // Requires sass-loader@^8.0.0
            options: {
              implementation: require("sass"),
              sassOptions: {
                fiber: require("fibers"),
                indentedSyntax: true // optional
              }
            }
          }
        ]
      },
      {
        test: /\.d\.ts$/,
        use: "ignore-loader"
      },
      {
        test: /\.ts$/,
        use: [
          "thread-loader",
          {
            loader: "babel-loader?cacheDirectory=true"
          },
          {
            loader: "ts-loader",
            options: { happyPackMode: true, appendTsSuffixTo: [/\.vue$/] }
          }
        ],
        exclude: /node_modules|\.d\.ts$/
      },
      {
        test: /\.css$/,
        use: ["thread-loader", "vue-style-loader", "css-loader"]
      },
      {
        test: /\.html$/,
        use: "vue-html-loader"
      },
      {
        test: /\.js$/,
        use: ["thread-loader", "babel-loader?cacheDirectory=true"],
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: "node-loader"
      },
      {
        test: /\.vue$/,
        use: [
          "thread-loader",
          {
            loader: "vue-loader",
            options: {
              extractCSS: process.env.NODE_ENV === "production"
            }
          }
        ]
      },
      {
        resourceQuery: /blockType=i18n/,
        type: "javascript/auto",
        loader: "@kazupon/vue-i18n-loader"
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: "url-loader",
          query: {
            limit: 10000,
            name: "imgs/[name]--[folder].[ext]"
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "media/[name]--[folder].[ext]"
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: "url-loader",
          query: {
            limit: 10000,
            name: "fonts/[name]--[folder].[ext]"
          }
        }
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== "production",
    __filename: process.env.NODE_ENV !== "production"
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new VuetifyLoaderPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({ filename: "styles.css" }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "../src/index.ejs"),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      nodeModules:
        process.env.NODE_ENV !== "production"
          ? path.resolve(__dirname, "../node_modules")
          : false
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "../dist/electron")
  },
  resolve: {
    alias: {
      "@": path.join(__dirname, "../src/renderer"),
      vue$: "vue/dist/vue.esm.js"
    },
    extensions: [".ts", ".js", ".vue", ".json", ".css", ".node"]
  },
  target: "electron-renderer"
};

/**
 * Adjust rendererConfig for development settings
 */
if (process.env.NODE_ENV !== "production") {
  rendererConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __static: `"${path.join(__dirname, "../static").replace(/\\/g, "\\\\")}"`
    })
  );
}

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === "production") {
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"'
    })
  );
}

module.exports = rendererConfig;
