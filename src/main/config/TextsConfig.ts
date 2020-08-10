import Config from './Config'

export default class TextsConfig extends Config {
  public getFilename (): string {
    return 'texts'
  }
  protected getDefaultObject (): yuki.Config.Texts {
    return {
      interceptor: {
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
      },
      modifier: {
        removeAscii: false,
        deduplicate: false,
        deduplicateCount: 0, 
        delineBreak: false
      },
      merger: {
        enable: true,
        timeout: 500
      }
    }
  }
}
