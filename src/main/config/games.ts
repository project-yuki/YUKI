import Config from "./config";

let defaultObject = {
  games: []
};

let gamesConfig = new Config("config/games.yml", defaultObject);

export default gamesConfig;
