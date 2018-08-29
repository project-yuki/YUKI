import Config from "../../common/config";

let defaultObject = {
  localeChangers: {
    localeEmulator: {
      name: "Locale Emulator",
      enabled: false,
      exec: ""
    },
    ntleas: {
      name: "Ntleas",
      enabled: false,
      exec: ""
    }
  },
  onlineApis: [],
  translators: {
    jBeijing: {
      enabled: false,
      path: ""
    }
  }
};

let defaultConfig = new Config("config/config.yml", defaultObject);

export default defaultConfig;
