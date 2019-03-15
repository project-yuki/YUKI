import Config from './Config'

export default class InterceptorConfig extends Config {

  public getFilename (): string {
    return 'interceptor'
  }
  protected getDefaultObject (): Yagt.Config.Interceptor {
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
      ignoreAsciiOnly: false
    }
  }
}
