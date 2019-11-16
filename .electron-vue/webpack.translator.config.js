"use strict";

process.env.BABEL_ENV = "translator";

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

let translatorConfig = {
  optimization: {
    minimize: false
  },
  mode: process.env.NODE_ENV,
  devtool: "#cheap-module-eval-source-map",
  entry: {
    translator: path.join(__dirname, "../src/translator/main.ts")
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
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "media/[name]--[folder].[ext]"
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
    new MiniCssExtractPlugin({ filename: "styles-translator.css" }),
    new HtmlWebpackPlugin({
      filename: "translator.html",
      template: path.resolve(__dirname, "../src/translator.ejs"),
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
      "@": path.join(__dirname, "../src/translator"),
      vue$: "vue/dist/vue.esm.js"
    },
    extensions: [".ts", ".js", ".vue", ".json", ".css", ".node"]
  },
  target: "electron-renderer"
};

/**
 * Adjust translatorConfig for development settings
 */
if (process.env.NODE_ENV !== "production") {
  translatorConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __static: `"${path.join(__dirname, "../static").replace(/\\/g, "\\\\")}"`
    })
  );
}

/**
 * Adjust translatorConfig for production settings
 */
if (process.env.NODE_ENV === "production") {
  translatorConfig.plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"'
    })
  );
}

module.exports = translatorConfig;
