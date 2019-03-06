import Config from "./config";

export default class InterceptorConfig extends Config {
  protected getDefaultObject(): Yagt.Config.Interceptor {
    return {
      shouldBeIgnore: [
        "value",
        "sys",
        "\u00020",
        "windowbtn",
        "00_プロローグ１",
        "menu",
        "WndDisp"
      ],
      ignoreAsciiOnly: false
    };
  }

  getFilename(): string {
    return "interceptor";
  }
}
