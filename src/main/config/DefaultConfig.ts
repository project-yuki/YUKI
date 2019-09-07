import Config from './Config'

export default class DefaultConfig extends Config {
  public getFilename (): string {
    return 'config'
  }
  protected getDefaultObject (): yuki.Config.Default {
    return {
      localeChangers: {
        localeEmulator: { name: 'Locale Emulator', enable: false, exec: '' },
        ntleas: { name: 'Ntleas', enable: false, exec: '' },
        noChanger: { name: 'No Changer', enable: true, exec: '%GAME_PATH%' }
      },
      onlineApis: [
        {
          enable: false,
          external: true,
          jsFile: 'config\\hjdictApi.js',
          name: '沪江'
        },
        {
          enable: true,
          method: 'POST',
          name: '谷歌',
          requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "hl": "zh-CN"}',
          responseBodyPattern: 'Rclass="t0">([^<]*)<',
          url: 'https://translate.google.cn/m'
        },
        {
          enable: true,
          method: 'POST',
          name: '彩云',
          requestBodyFormat: 'J{"source": %TEXT%, "trans_type": "ja2zh", ' +
                              '"request_id": "web_fanyi", "os_type": "web", ' +
                              '"dict": "false", "cached": "false", "replaced": "false"}',
          requestHeaders: '{"X-Authorization": "token:cy4fgbil24jucmh8jfr5"}',
          responseBodyPattern: 'J%RESPONSE%.target',
          url: 'https://api.interpreter.caiyunai.com/v1/translator'
        },
        {
          enable: true,
          external: true,
          jsFile: 'config\\qqApi.js',
          name: '腾讯'
        }
      ],
      translators: { jBeijing: { enable: false, path: '', dictPath: '' } },
      mecab: { enable: false, path: '' },
      librariesRepoUrl: 'https://github.com/project-yuki/libraries/raw/master/_pack/',
      language: 'zh'
    }
  }
}
