import { app, ipcMain, dialog } from "electron";
import types from "../../common/ipcTypes";
const debug = require("debug")("yagt:ipc");
import configManager from "../config";
import hooker from "../hooker";
import Game from "../game";
import TranslatorWindow from "../translatorWindow";
import TranslationManager from "../translate/translationManager";
import { extname } from "path";

let runningGame: Game;
let translatorWindow: TranslatorWindow | null;

export default function(mainWindow: Electron.BrowserWindow) {
  ipcMain.on(types.MAIN_PAGE_LOAD_FINISHED, () => {
    debug("main page load finished. starting apis...");
    TranslationManager.getInstance().initializeApis(
      configManager.getInstance().get("default").onlineApis
    );
    TranslationManager.getInstance().initializeTranslators(
      configManager.getInstance().get("default").translators
    );
    debug("apis started");
  });

  ipcMain.on(
    types.REQUEST_RUN_GAME,
    (event: Electron.Event, game: Yagt.Game) => {
      mainWindow.hide();

      runningGame = new Game(game);
      runningGame.on("started", () => {
        if (translatorWindow) translatorWindow.close();
        translatorWindow = new TranslatorWindow();
        translatorWindow.setGame(runningGame);
      });
      runningGame.on("exited", () => {
        if (translatorWindow) translatorWindow.close();
        translatorWindow = null;
        mainWindow.show();
      });
      runningGame.start();
    }
  );

  ipcMain.on(
    types.REQUEST_INSERT_HOOK,
    (event: Electron.Event, code: string) => {
      if (code !== "") {
        hooker.getInstance().insertHook(runningGame.getPid(), code);
      }
    }
  );

  ipcMain.on(types.REQUEST_CONFIG, (event: Electron.Event, name: string) => {
    if (name === "game") {
      requestGame(event);
      return;
    }
    debug("request config %s", configManager.getInstance().getFilename(name));
    sendConfig(name, event);
  });

  function requestGame(event: Electron.Event) {
    if (translatorWindow) {
      debug("request config %o", translatorWindow.getGameInfo());
      sendGameInfo(event);
    } else {
      debug(`no translator window`);
    }
  }

  ipcMain.on(
    types.REQUEST_SAVE_CONFIG,
    (event: Electron.Event, name: string, cfg: any) => {
      let configFileName = configManager.getInstance().getFilename(name);
      debug(`request saving config %s...`, configFileName);
      configManager.getInstance().set(name, cfg);
      debug("config %s saved. resend it to window", configFileName);
      sendConfig(name, event);
    }
  );

  ipcMain.on(
    types.REQUEST_SAVE_TRANSLATOR_GUI,
    (event: Electron.Event, cfg: any) => {
      debug("request saving translator gui config...");
      configManager.getInstance().set("gui", {
        ...configManager.getInstance().get("gui"),
        translatorWindow: cfg
      });
      debug("translator gui config saved");
    }
  );

  ipcMain.on(
    types.REQUEST_ADD_GAME,
    (event: Electron.Event, game: Yagt.Game) => {
      configManager
        .getInstance()
        .get("games")
        .push(game);
      configManager.getInstance().save("games");
      sendConfig("games", event);
      event.sender.send(types.HAS_ADDED_GAME);
    }
  );

  ipcMain.on(
    types.REQUEST_REMOVE_GAME,
    (event: Electron.Event, game: Yagt.Game) => {
      configManager.getInstance().set(
        "games",
        configManager
          .getInstance()
          .get("games")
          .filter((item: Yagt.Game) => item.name !== game.name)
      );
      sendConfig("games", event);
    }
  );

  ipcMain.on(types.REQUEST_NEW_GAME_PATH, (event: Electron.Event) => {
    dialog.showOpenDialog(
      {
        properties: ["openFile"],
        filters: [{ name: "可执行文件", extensions: ["exe"] }]
      },
      files => {
        if (files) {
          event.sender.send(types.HAS_NEW_GAME_PATH, files[0]);
        }
      }
    );
  });

  ipcMain.on(
    types.REQUEST_PATH_WITH_FILE,
    (event: Electron.Event, filename: string) => {
      const extension = extname(filename).substring(1);
      dialog.showOpenDialog(
        {
          title: `请选择文件夹下的 ${filename}`,
          properties: ["openFile"],
          filters: [{ name: extension, extensions: [extension] }]
        },
        files => {
          if (files) {
            event.sender.send(types.HAS_PATH_WITH_FILE, files[0]);
          }
        }
      );
    }
  );

  ipcMain.on(types.APP_EXIT, () => {
    app.quit();
  });

  ipcMain.on(
    types.REQUEST_TRANSLATION,
    (event: Electron.Event, text: string) => {
      TranslationManager.getInstance().translate(text, translation => {
        event.sender.send(types.HAS_TRANSLATION, translation);
      });
    }
  );
}

function sendConfig(configName: string, event: Electron.Event) {
  event.sender.send(
    types.HAS_CONFIG,
    configName,
    configManager.getInstance().get(configName)
  );
}

function sendGameInfo(event: Electron.Event) {
  event.sender.send(
    types.HAS_CONFIG,
    "game",
    (<TranslatorWindow>translatorWindow).getGameInfo()
  );
}

app.on("before-quit", () => {
  if (translatorWindow) {
    require("debug")("yagt:app")("closing translator window...");
    translatorWindow.close();
    translatorWindow = null;
    require("debug")("yagt:app")("translator window closed");
  }
  require("debug")("yagt:app")("app quited");
});
