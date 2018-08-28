import Config from "../../common/config";

let defaultObject = {
  localeChangers: [
    {
      name: "Locale Emulator",
      enabled: false,
      exec: ""
    },
    {
      name: "Ntleas",
      enabled: false,
      exec: ""
    }
  ],
  onlineApis: [],
  translators: {
    jBeijing: {
      enabled: false,
      path: ""
    }
  }
};

export default new Config("config/config.yml", defaultObject);
