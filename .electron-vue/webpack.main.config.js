"use strict";

process.env.BABEL_ENV = "main";

const path = require("path");
const { dependencies, devDependencies } = require("../package.json");
const webpack = require("webpack");
const InjectPlugin = require("webpack-inject-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

let mainConfig = {
  optimization: {
    minimize: false
  },
  mode: process.env.NODE_ENV,
  entry: {
    main: path.join(__dirname, "../src/main/index.ts")
  },
  externals: [
    ...Object.keys(dependencies || {}),
    ...Object.keys(devDependencies || {})
  ],
  module: {
    rules: [
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
        test: /\.js$/,
        use: ["thread-loader", "babel-loader?cacheDirectory=true"],
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: "node-loader"
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== "production",
    __filename: process.env.NODE_ENV !== "production"
  },
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "../dist/electron")
  },
  plugins: [
    new InjectPlugin.default(
      function() {
        return "process.env.DEBUG = 'yuki:*';process.env.DEBUG_COLORS = '1';";
      },
      { entryOrder: InjectPlugin.ENTRY_ORDER.First }
    ),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    extensions: [".ts", ".js", ".json", ".node"]
  },
  target: "electron-main"
};

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== "production") {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      __static: `"${path.join(__dirname, "../static").replace(/\\/g, "\\\\")}"`
    })
  );
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === "production") {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"'
    })
  );
}

module.exports = mainConfig;
