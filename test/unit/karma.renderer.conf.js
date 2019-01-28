"use strict";

const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");

const baseConfig = require("../../.electron-vue/webpack.renderer.config");
const projectRoot = path.resolve(__dirname, "../../src/renderer");

// Set BABEL_ENV to use proper preset config
process.env.BABEL_ENV = "test";

let webpackConfig = merge(baseConfig, {
  devtool: "#inline-source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"testing"'
    })
  ]
});

// don't treat dependencies as externals
delete webpackConfig.entry;
delete webpackConfig.externals;
delete webpackConfig.output.libraryTarget;

module.exports = config => {
  config.set({
    browsers: ["visibleElectron"],
    client: {
      useIframe: false
    },
    coverageReporter: {
      dir: "./coverage",
      reporters: [{ type: "lcov", subdir: "." }, { type: "text-summary" }]
    },
    customLaunchers: {
      visibleElectron: {
        base: "Electron",
        flags: ["--show"]
      }
    },
    frameworks: ["mocha", "chai"],
    files: ["./renderer.js"],
    preprocessors: {
      "./renderer.js": ["webpack", "sourcemap"]
    },
    reporters: ["spec", "coverage"],
    singleRun: true,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }
  });
};
