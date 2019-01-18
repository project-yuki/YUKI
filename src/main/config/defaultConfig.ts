import Config from "./config";

export default class DefaultConfig extends Config {
  protected getDefaultObject(): object {
    return {
      localeChangers: {
        localeEmulator: { name: "Locale Emulator", enable: false, exec: "" },
        ntleas: { name: "Ntleas", enable: false, exec: "" },
        noChanger: { name: "No Changer", enable: true, exec: "%GAME_PATH%" }
      },
      onlineApis: [
        {
          name: "baidu",
          enable: true,
          url: "https://fanyi.baidu.com/transapi",
          method: "POST",
          requestBodyFormat: 'X{"query": %TEXT%, "from": "jp", "to": "zh"}',
          responseBodyPattern: "J%RESPONSE%.data[0].dst"
        },
        {
          name: "googleCN",
          enable: true,
          url: "https://translate.google.cn/m",
          method: "POST",
          requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
          responseBodyPattern: 'Rclass="t0">([^<]*)<'
        }
      ],
      translators: { jBeijing: { enable: false, path: "" } }
    };
  }

  getFilename(): string {
    return "config";
  }
}
