"use strict";

const chalk = require("chalk");
const electron = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackHotMiddleware = require("webpack-hot-middleware");

const mainConfig = require("./webpack.main.config");
const rendererConfig = require("./webpack.renderer.config");
const translatorConfig = require("./webpack.translator.config");
const ProgressPlugin = require("webpack/lib/ProgressPlugin");

let electronProcess = null;
let manualRestart = false;
let hotMiddleware;

const threadLoader = require("thread-loader");

threadLoader.warmup({}, [
    // modules to load
    // can be any module, i. e.
    "ts-loader",
    "babel-loader",
    "vue-loader",
    "vue-style-loader",
    "css-loader",
    "sass-loader"
  ]
);

function logStats(proc, data) {
  let log = "";

  log += chalk.bgYellow.white.bold(` ${proc} Process \n`);

  if (typeof data === "object") {
    data
      .toString({
        colors: true,
        chunks: false
      })
      .split(/\r?\n/)
      .forEach(line => {
        log += "  " + line + "\n";
      });
  } else {
    log += `  ${data}`;
  }

  console.log(log);
}

function startRenderer() {
  return new Promise((resolve, reject) => {
    rendererConfig.entry.renderer = [path.join(__dirname, "dev-client")].concat(
      rendererConfig.entry.renderer
    );
    rendererConfig.mode = "development";
    const rendererCompiler = webpack(rendererConfig);
    hotMiddleware = webpackHotMiddleware(rendererCompiler, {
      log: false,
      heartbeat: 2500
    });

    // rendererCompiler.apply(
    //   new ProgressPlugin(function(
    //     percentage,
    //     msg,
    //     current,
    //     active,
    //     modulepath
    //   ) {
    //     if (process.stdout.isTTY && percentage < 1) {
    //       // process.stdout.cursorTo(0);
    //       // modulepath = modulepath
    //       //   ? " …" + modulepath.substr(modulepath.length - 30)
    //       //   : "";
    //       current = current ? " " + current : "";
    //       active = active ? " " + active : "";
    //       process.stdout.write(
    //         (percentage * 100).toFixed(0) +
    //           "% " +
    //           msg +
    //           current +
    //           active +
    //           modulepath +
    //           "\n"
    //       );
    //       // process.stdout.clearLine(1);
    //     } else if (percentage === 1) {
    //       process.stdout.write("\n");
    //       console.log("webpack: done.");
    //     }
    //   })
    // );

    rendererCompiler.hooks.compilation.tap("compilation", compilation => {
      compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync(
        "html-webpack-plugin-after-emit",
        (data, cb) => {
          hotMiddleware.publish({ action: "reload" });
          cb();
        }
      );
    });

    rendererCompiler.hooks.done.tap("done", stats => {
      logStats("Renderer", stats);
    });

    const rendererServer = new WebpackDevServer(rendererCompiler, {
      contentBase: path.join(__dirname, "../"),
      quiet: true,
      before(app, ctx) {
        app.use(hotMiddleware);
        ctx.middleware.waitUntilValid(() => {
          resolve();
        });
      }
    });

    rendererServer.listen(9080);
  });
}

function startTranslator() {
  return new Promise((resolve, reject) => {
    translatorConfig.entry.translator = [
      path.join(__dirname, "dev-client")
    ].concat(translatorConfig.entry.translator);
    translatorConfig.mode = "development";
    const translatorCompiler = webpack(translatorConfig);
    hotMiddleware = webpackHotMiddleware(translatorCompiler, {
      log: false,
      heartbeat: 2500
    });

    translatorCompiler.hooks.compilation.tap("compilation", compilation => {
      compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync(
        "html-webpack-plugin-after-emit",
        (data, cb) => {
          hotMiddleware.publish({ action: "reload" });
          cb();
        }
      );
    });

    translatorCompiler.hooks.done.tap("done", stats => {
      logStats("Translator", stats);
    });

    const translatorServer = new WebpackDevServer(translatorCompiler, {
      contentBase: path.join(__dirname, "../"),
      quiet: true,
      before(app, ctx) {
        app.use(hotMiddleware);
        ctx.middleware.waitUntilValid(() => {
          resolve();
        });
      }
    });

    translatorServer.listen(9081);
  });
}

function startMain() {
  return new Promise((resolve, reject) => {
    mainConfig.entry.main = [
      path.join(__dirname, "../src/main/index.dev.ts")
    ].concat(mainConfig.entry.main);
    mainConfig.mode = "development";
    mainConfig.devtool = "#inline-source-map";
    const compiler = webpack(mainConfig);

    compiler.hooks.watchRun.tapAsync("watch-run", (compilation, done) => {
      hotMiddleware.publish({ action: "compiling" });
      done();
    });

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
        return;
      }

      logStats("Main", stats);

      if (electronProcess && electronProcess.kill) {
        manualRestart = true;
        process.kill(electronProcess.pid);
        electronProcess = null;
        startElectron();

        setTimeout(() => {
          manualRestart = false;
        }, 5000);
      }

      resolve();
    });
  });
}

function startElectron() {
  var args = [
    "--inspect=5858",
    path.join(__dirname, "../dist/electron/main.js")
  ];

  // detect yarn or npm and process commandline args accordingly
  if (process.env.npm_execpath.endsWith("yarn.js")) {
    args = args.concat(process.argv.slice(3));
  } else if (process.env.npm_execpath.endsWith("npm-cli.js")) {
    args = args.concat(process.argv.slice(2));
  }

  electronProcess = spawn(electron, args, {
    stdio: "inherit"
  });

  electronProcess.on("close", () => {
    if (!manualRestart) process.exit();
  });
}

function init() {
  console.log("starting...");
  Promise.all([startTranslator(), startRenderer(), startMain()])
    .then(() => {
      startElectron();
    })
    .catch(err => {
      console.error(err);
    });
}

init();
