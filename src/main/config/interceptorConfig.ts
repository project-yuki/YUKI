import Config from "./config";

export default class InterceptorConfig extends Config {
  protected getDefaultObject(): object {
    return { shouldBeIgnore: [] };
  }

  getFilename(): string {
    return "interceptor";
  }
}
