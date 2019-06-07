import Config from './Config'

export default class InterceptorConfig extends Config {
  public getFilename (): string {
    return 'interceptor'
  }
  protected getDefaultObject (): yuki.Config.Interceptor {
    return {
      shouldBeIgnore: [
        'value',
        'sys',
        '\u00020',
        'windowbtn',
        '00_プロローグ１',
        'menu',
        'WndDisp'
      ],
      ignoreAsciiOnly: false,
      maxLength: 1000
    }
  }
}
