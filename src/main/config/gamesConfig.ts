import Config from "./config";

export default class GamesConfig extends Config {
  protected getDefaultObject(): { games: Yagt.Config.Games } {
    return { games: [] };
  }

  getFilename(): string {
    return "games";
  }

  get() {
    return this.config.games;
  }

  set(cfg: any) {
    this.config.games = cfg;
    this.save();
  }
}
