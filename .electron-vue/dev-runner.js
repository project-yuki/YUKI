"use strict";

const chalk = require("chalk");
const electron = require("electron");
const path = require("path");
const { say } = require("cfonts");
const { spawn } = require("child_process");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackHotMiddleware = require("webpack-hot-middleware");

const mainConfig = require("./webpack.main.config");
const rendererConfig = require("./webpack.renderer.config");
const translatorConfig = require("./webpack.translator.config");

let electronProcess = null;
let manualRestart = false;
let hotMiddleware;
let translatorHotMiddleware;

function logStats(proc, data) {
  let log = "";

  log += chalk.yellow.bold(
    `┏ ${proc} Process ${new Array(19 - proc.length + 1).join("-")}`
  );
  log += "\n\n";

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
    log += `  ${data}\n`;
  }

  log += "\n" + chalk.yellow.bold(`┗ ${new Array(28 + 1).join("-")}`) + "\n";

  console.log(log);
}

function startRenderer() {
  return new Promise((resolve, reject) => {
    rendererConfig.entry.renderer = [path.join(__dirname, "dev-client")].concat(
      rendererConfig.entry.renderer
    );

    const rendererCompiler = webpack(rendererConfig);
    hotMiddleware = webpackHotMiddleware(rendererCompiler, {
      log: false,
      heartbeat: 2500
    });

    rendererCompiler.plugin("compilation", compilation => {
      compilation.plugin("html-webpack-plugin-after-emit", (data, cb) => {
        hotMiddleware.publish({ action: "reload" });
        cb();
      });
    });

    rendererCompiler.plugin("done", stats => {
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

    const translatorCompiler = webpack(translatorConfig);
    translatorHotMiddleware = webpackHotMiddleware(translatorCompiler, {
      log: false,
      heartbeat: 2500
    });

    translatorCompiler.plugin("compilation", compilation => {
      compilation.plugin("html-webpack-plugin-after-emit", (data, cb) => {
        translatorHotMiddleware.publish({ action: "reload" });
        cb();
      });
    });

    translatorCompiler.plugin("done", stats => {
      logStats("Translator", stats);
    });

    const translatorServer = new WebpackDevServer(translatorCompiler, {
      contentBase: path.join(__dirname, "../"),
      quiet: true,
      before(app, ctx) {
        app.use(translatorHotMiddleware);
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

    const compiler = webpack(mainConfig);

    compiler.plugin("watch-run", (compilation, done) => {
      logStats("Main", chalk.white.bold("compiling..."));
      hotMiddleware.publish({ action: "compiling" });
      translatorHotMiddleware.publish({ action: "compiling" });
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
  electronProcess = spawn(electron, ["--inspect=5858", "."]);

  electronProcess.stdout.on("data", data => {
    electronLog(data, "blue");
  });
  electronProcess.stderr.on("data", data => {
    electronLog(data, "red");
  });

  electronProcess.on("close", () => {
    if (!manualRestart) process.exit();
  });
}

function electronLog(data, color) {
  let log = "";
  data = data.toString().split(/\r?\n/);
  data.forEach(line => {
    log += `  ${line}\n`;
  });
  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold("┏ Electron -------------------") +
        "\n\n" +
        log +
        chalk[color].bold("┗ ----------------------------") +
        "\n"
    );
  }
}

function greeting() {
  const cols = process.stdout.columns;
  let text = "";

  if (cols > 104) text = "electron-vue";
  else if (cols > 76) text = "electron-|vue";
  else text = false;

  if (text) {
    say(text, {
      colors: ["yellow"],
      font: "simple3d",
      space: false
    });
  } else console.log(chalk.yellow.bold("\n  electron-vue"));
  console.log(chalk.blue("  getting ready...") + "\n");
}

function init() {
  greeting();

  Promise.all([startTranslator(), startRenderer(), startMain()])
    .then(() => {
      startElectron();
    })
    .catch(err => {
      console.error(err);
    });
}

init();
