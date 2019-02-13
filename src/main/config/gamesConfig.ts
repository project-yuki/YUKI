import Config from "./config";

export default class GamesConfig extends Config {
  protected getDefaultObject(): object {
    return { games: [] };
  }

  getFilename(): string {
    return "games";
  }

  get() {
    return this.config.games;
  }
}
