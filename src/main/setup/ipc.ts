import { app, ipcMain, dialog } from "electron";
import types from "../../common/ipcTypes";
import logger from "../../common/logger";
import config from "../config";
import hooker from "../../common/hooker";
import Game from "../game";
import createTranslatorWindow from "./translatorWindow";

let runningGamePid = -1;

let translatorWindow: Electron.BrowserWindow;

export default function(mainWindow: Electron.BrowserWindow) {
  ipcMain.on(types.MAIN_PAGE_LOAD_FINISHED, () => {
    logger.info(`main page load finished.`);
    hooker.subscribe("thread-create", mainWindow.webContents);
    hooker.subscribe("thread-remove", mainWindow.webContents);
    hooker.subscribe("thread-output", mainWindow.webContents);
  });

  ipcMain.on(
    types.REQUEST_RUN_GAME,
    (event: Electron.Event, game: Yagt.Game) => {
      mainWindow.hide();

      let runningGame = new Game(game);
      runningGame.on("started", () => {
        translatorWindow = createTranslatorWindow();
      });
      runningGame.on("exited", () => {
        runningGame.removeAllListeners();
        if (!translatorWindow.isDestroyed()) translatorWindow.close();
        mainWindow.show();
      });
      runningGame.start();
    }
  );

  ipcMain.on(
    types.REQUEST_INSERT_HOOK,
    (event: Electron.Event, code: string) => {
      logger.debug(`inserting hook ${code} to process ${runningGamePid}...`);
      hooker.insertHook(runningGamePid, code);
      logger.debug(`hook ${code} inserted`);
    }
  );

  ipcMain.on(
    types.REQUEST_REMOVE_HOOK,
    (event: Electron.Event, thread: Yagt.TextThread) => {
      logger.debug(
        `removing hook ${thread.hook} from process ${runningGamePid}...`
      );
      hooker.removeHook(runningGamePid, thread.hook);
      logger.debug(`hook ${thread.hook} removed`);
    }
  );

  ipcMain.on(types.REQUEST_CONFIG, (event: Electron.Event, name: string) => {
    switch (name) {
      case "default":
        logger.debug(`request config ${config.default.getFileName()}`);
        event.sender.send(types.HAS_CONFIG, name, config.default.get());
        break;
      case "games":
        logger.debug(`request config ${config.games.getFileName()}`);
        event.sender.send(types.HAS_CONFIG, name, config.games.get().games);
        break;
      default:
        logger.error(`invalid config name: ${name}`);
        break;
    }
  });

  ipcMain.on(
    types.REQUEST_SAVE_CONFIG,
    (event: Electron.Event, name: string, cfg: any) => {
      let configFileName = `config/${name}.yml`;
      logger.debug(`request saving config ${configFileName}: `);
      logger.debug(cfg);

      switch (name) {
        case "default":
          config.default.set(cfg);
          logger.debug(`config ${configFileName} saved`);
          event.sender.send(types.HAS_CONFIG, name, config.default.get());
          break;
        case "games":
          config.games.set(cfg);
          logger.debug(`config ${configFileName} saved`);
          event.sender.send(types.HAS_CONFIG, name, config.games.get());
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
      config.games.get().games.push(game);
      config.games.save();
      event.sender.send(types.HAS_CONFIG, "games", config.games.get().games);
      event.sender.send(types.HAS_ADDED_GAME);
    }
  );

  ipcMain.on(
    types.REQUEST_REMOVE_GAME,
    (event: Electron.Event, game: Yagt.Game) => {
      config.games.set({
        games: config.games
          .get()
          .games.filter((item: Yagt.Game) => item.name !== game.name)
      });
      event.sender.send(types.HAS_CONFIG, "games", config.games.get().games);
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

  ipcMain.on(types.APP_EXIT, (event: Electron.Event) => {
    app.quit();
  });
}
