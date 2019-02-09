import Config from "./config";

export default class InterceptorConfig extends Config {
  protected getDefaultObject(): object {
    return {
      shouldBeIgnore: [
        "value",
        "sys",
        "\u00020",
        "windowbtn",
        "00_プロローグ１",
        "menu",
        "WndDisp"
      ]
    };
  }

  getFilename(): string {
    return "interceptor";
  }
}
