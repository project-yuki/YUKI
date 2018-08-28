/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

// Set environment for development
process.env.NODE_ENV = "development";

// Install `electron-debug` with `devtron`
require("electron-debug")({ showDevTools: true });

// Install `vue-devtools`
require("electron").app.on("ready", () => {
  require("vue-devtools").install();
});

// Require `main` process to boot app
require("./index");
