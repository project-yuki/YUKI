import Config from "../../common/config";

let defaultObject = {
  games: []
};

export default new Config("config/games.yml", defaultObject);
