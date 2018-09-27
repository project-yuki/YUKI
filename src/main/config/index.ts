import defaultConfig from "./default";
import gamesConfig from "./games";
import Config from "./config";

interface Configs {
  default: Config;
  games: Config;
}

let configs: Configs = {
  default: defaultConfig,
  games: gamesConfig
};

export default configs;
