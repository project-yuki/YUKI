import { exec } from "child_process";
import logger from "../common/logger";
import config from "./config";
import { registerProcessExitCallback } from "./win32";
import hooker from "./hooker";
import { EventEmitter } from "events";

export default class Game extends EventEmitter {
  private readonly TIMEOUT = 1000;
  private execString: string;
  private path: string;
  private code: string;
  private pid: number;
  private name: string;
  private exeName: string;

  constructor(game: Yagt.Game) {
    super();
    this.path = game.path;
    this.execString = "";
    this.pid = -1;
    this.code = game.code;
    this.name = game.name;
    this.exeName = "";
  }

  start() {
    this.execGameProcess();
    this.registerHookerWithPid();
  }

  private execGameProcess() {
    this.getRawExecStringOrDefault();
    this.replaceExecStringTokensWithActualValues();
    logger.debug(`game: exec string: ${this.execString}`);
    exec(this.execString);
  }

  private getRawExecStringOrDefault() {
    const localeChangers: Yagt.Config.Default["localeChangers"] = config.games.get()
      .localeChangers;
    for (let key in localeChangers) {
      if (localeChangers[key].enabled === true) {
        logger.debug(
          `game: choose ${localeChangers[key].name} as locale changer`
        );
        this.execString = localeChangers[key].exec;
        return;
      }
    }
    logger.warn("game: no locale changer chosed. use default");
    this.execString = "%GAME_PATH%";
  }

  private replaceExecStringTokensWithActualValues() {
    this.execString = this.execString.replace("%GAME_PATH%", `"${this.path}"`);
  }

  private registerHookerWithPid() {
    this.exeName = this.path.substring(this.path.lastIndexOf("\\") + 1);
    logger.debug(`game: finding pid of ${this.exeName}...`);
    this.tryGetPidAnd(() => {
      this.injectProcessByPid();
      this.insertHookIfHasCode();
      this.emit("started", this);
      this.registerProcessExitCallback();
    });
  }

  private tryGetPidAnd(then: Function) {
    let pidGetterInterval = setInterval(() => {
      exec(
        `tasklist /nh /fo csv /fi "imagename eq ${this.exeName}"`,
        (err, stdout, stderr) => {
          console.log(stdout);
          if (this.findsPidIn(stdout)) {
            clearInterval(pidGetterInterval);
            this.pid = this.parsePidFrom(stdout);
            then();
          }
        }
      );
    }, this.TIMEOUT);
  }

  private findsPidIn(value: string) {
    return value.startsWith('"');
  }

  private parsePidFrom(value: string) {
    return parseInt(value.replace(/"/g, "").split(",")[1]);
  }

  private injectProcessByPid() {
    logger.debug(`injecting process ${this.pid}...`);
    hooker.injectProcess(this.pid);
    logger.debug(`process ${this.pid} injected`);
  }

  private insertHookIfHasCode() {
    if (this.code !== "") {
      logger.debug(`inserting hook ${this.code} to process ${this.pid}...`);
      hooker.insertHook(this.pid, this.code);
      logger.debug(`hook ${this.code} inserted`);
    }
  }

  private registerProcessExitCallback() {
    registerProcessExitCallback(this.pid, () => {
      this.detachProcessByPid();
      this.pid = -1;
      this.emit("exited", this);
    });
  }

  private detachProcessByPid() {
    logger.debug(`detaching process ${this.pid}...`);
    hooker.detachProcess(this.pid);
    logger.debug(`process ${this.pid} detached`);
    logger.debug(`game [${this.pid}] exited`);
  }

  getPid() {
    return this.pid;
  }

  getCode() {
    return this.code;
  }

  getName() {
    return this.name;
  }
}
