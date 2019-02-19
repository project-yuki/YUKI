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
          enable: true,
          method: "POST",
          name: "百度",
          requestBodyFormat: 'X{"query": %TEXT%, "from": "jp", "to": "zh"}',
          responseBodyPattern: "J%RESPONSE%.data[0].dst",
          url: "https://fanyi.baidu.com/transapi"
        },
        {
          enable: true,
          method: "POST",
          name: "谷歌",
          requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
          responseBodyPattern: 'Rclass="t0">([^<]*)<',
          url: "https://translate.google.cn/m"
        },
        {
          enable: true,
          external: true,
          jsFile: "config\\youdaoApi.js",
          name: "有道"
        }
      ],
      translators: { jBeijing: { enable: false, path: "" } },
      mecab: { enable: false, path: "" }
    };
  }

  getFilename(): string {
    return "config";
  }
}
