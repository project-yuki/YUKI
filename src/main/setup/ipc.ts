import { app, ipcMain, dialog } from "electron";
import types from "../../common/ipcTypes";
import logger from "../../common/logger";
import configManager from "../config";
import hooker from "../hooker";
import Game from "../game";
import TranslatorWindow from "../translatorWindow";
import TranslationManager from "../translate/translationManager";

let runningGame: Game;
let translatorWindow: TranslatorWindow;

export default function(mainWindow: Electron.BrowserWindow) {
  ipcMain.on(types.MAIN_PAGE_LOAD_FINISHED, () => {
    logger.info(`main page load finished.`);
    TranslationManager.getInstance().initialize(
      configManager.getInstance().get("default").onlineApis
    );
  });

  ipcMain.on(
    types.REQUEST_RUN_GAME,
    (event: Electron.Event, game: Yagt.Game) => {
      mainWindow.hide();

      runningGame = new Game(game);
      runningGame.on("started", () => {
        translatorWindow = new TranslatorWindow();
        translatorWindow.setGame(runningGame);
      });
      runningGame.on("exited", () => {
        runningGame.removeAllListeners();
        translatorWindow.close();
        mainWindow.show();
      });
      runningGame.start();
    }
  );

  ipcMain.on(
    types.REQUEST_INSERT_HOOK,
    (event: Electron.Event, code: string) => {
      if (code !== "") {
        logger.debug(
          `inserting hook ${code} to process ${runningGame.getPid()}...`
        );
        hooker.insertHook(runningGame.getPid(), code);
        logger.debug(`hook ${code} inserted`);
      }
    }
  );

  ipcMain.on(
    types.REQUEST_REMOVE_HOOK,
    (event: Electron.Event, thread: Yagt.TextThread) => {
      logger.debug(
        `removing hook ${thread.hook} from process ${runningGame.getPid()}...`
      );
      hooker.removeHook(runningGame.getPid(), thread.hook);
      logger.debug(`hook ${thread.hook} removed`);
    }
  );

  ipcMain.on(types.REQUEST_CONFIG, (event: Electron.Event, name: string) => {
    switch (name) {
      case "default":
        logger.debug(
          `request config ${configManager.getInstance().getFileName(name)}`
        );
        sendDefaultConfig(event);
        break;
      case "games":
        logger.debug(
          `request config ${configManager.getInstance().getFileName(name)}`
        );
        sendGamesConfig(event);
        break;
      case "game":
        logger.debug(`request config ${translatorWindow.getGameInfo()}`);
        sendGameInfo(event);
        break;
      default:
        logger.error(`invalid config name: ${name}`);
        break;
    }
  });

  ipcMain.on(
    types.REQUEST_SAVE_CONFIG,
    (event: Electron.Event, name: string, cfg: any) => {
      let configFileName = configManager.getInstance().getFileName(name);
      logger.debug(`request saving config ${configFileName}: `);
      logger.debug(cfg);

      switch (name) {
        case "default":
          configManager.getInstance().set(name, cfg);
          logger.debug(`config ${configFileName} saved`);
          sendDefaultConfig(event);
          break;
        case "games":
          configManager.getInstance().set(name, cfg);
          logger.debug(`config ${configFileName} saved`);
          sendGamesConfig(event);
          break;
        default:
          logger.error(`invalid config name: ${name}`);
          break;
      }
    }
  );

  ipcMain.on(
    types.REQUEST_ADD_GAME,
    (event: Electron.Event, game: Yagt.Game) => {
      configManager
        .getInstance()
        .get("games")
        .games.push(game);
      configManager.getInstance().save("games");
      sendGamesConfig(event);
      event.sender.send(types.HAS_ADDED_GAME);
    }
  );

  ipcMain.on(
    types.REQUEST_REMOVE_GAME,
    (event: Electron.Event, game: Yagt.Game) => {
      configManager.getInstance().set("games", {
        games: configManager
          .getInstance()
          .get("games")
          .games.filter((item: Yagt.Game) => item.name !== game.name)
      });
      sendGamesConfig(event);
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

function sendDefaultConfig(event: Electron.Event) {
  event.sender.send(
    types.HAS_CONFIG,
    "default",
    configManager.getInstance().get("default")
  );
}

function sendGamesConfig(event: Electron.Event) {
  event.sender.send(
    types.HAS_CONFIG,
    "games",
    configManager.getInstance().get("games").games
  );
}

function sendGameInfo(event: Electron.Event) {
  event.sender.send(types.HAS_CONFIG, "game", translatorWindow.getGameInfo());
}
