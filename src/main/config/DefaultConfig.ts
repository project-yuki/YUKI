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
          enable: true,
          external: true,
          jsFile: 'config\\youdaoApi.js',
          name: '有道'
        },
        {
          enable: false,
          method: 'POST',
          name: '谷歌',
          requestBodyFormat: 'X{"q": %TEXT%, "sl": "ja", "tl": "zh-CN"}',
          responseBodyPattern: 'Rclass="t0">([^<]*)<',
          url: 'https://translate.google.cn/m'
        },
        {
          enable: false,
          method: 'POST',
          name: '彩云',
          requestBodyFormat:
            'J{"source": %TEXT%, "trans_type": "ja2zh", ' +
            '"request_id": "demo", "detect": "true"}',
          requestHeaders: '{"X-Authorization": "token 3975l6lr5pcbvidl6jl2"}',
          responseBodyPattern: 'J%RESPONSE%.target',
          url: 'https://api.interpreter.caiyunai.com/v1/translator'
        },
        {
          enable: true,
          external: true,
          jsFile: 'config\\qqApi.js',
          name: '腾讯'
        },
        {
          enable: false,
          external: true,
          jsFile: 'config\\tencentApi.js',
          name: '腾讯云'
        },
        {
          enable: false,
          external: true,
          jsFile: 'config\\azureApi.js',
          name: 'Azure'
        },
        {
          enable: false,
          external: true,
          jsFile: 'config\\baiduApi.js',
          name: '百度'
        },
        {
          enable: false,
          external: true,
          jsFile: 'config\\newBaiduApi.js',
          name: '百度开放平台'
        }
      ],
      translators: { jBeijing: { enable: false, path: '', dictPath: '' } },
      dictionaries: { lingoes: { enable: false, path: '' } },
      mecab: { enable: false, path: '' },
      librariesRepoUrl:
        'https://github.com/project-yuki/libraries/raw/master/_pack/',
      language: 'zh'
    }
  }
}
