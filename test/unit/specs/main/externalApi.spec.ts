import { expect } from 'chai'
import ExternalApi from '../../../../src/main/translate/ExternalApi'

describe('ExternalApi', () => {
  before(() => {
    (global as any).__baseDir = __dirname
  })

  it('gets translation from external JS file', () => {
    const youdao = new ExternalApi({
      enable: true,
      external: true,
      jsFile: '..\\..\\temp\\youdaoApi.js',
      name: 'youdao'
    })

    return youdao
      .translate('悠真くんを攻略すれば２１０円か。なるほどなぁ…')
      .then((translation) => {
        expect(translation).to.equal(
          '如果进攻悠真君,210日元?原来如此啊……'
        )
      })
  }).timeout(5000)

  it('keeps session when request multiple times', () => {
    const youdao = new ExternalApi({
      enable: true,
      external: true,
      jsFile: '..\\..\\temp\\youdaoApi.js',
      name: 'youdao'
    })

    return youdao
      .translate('悠真くんを攻略すれば２１０円か。なるほどなぁ…')
      .then((translation) => {
        expect(translation).to.equal(
          '如果进攻悠真君,210日元?原来如此啊……'
        )
      })
      .then(() =>
        youdao.translate(
          'はいっ、今日は柚子の入浴剤が入ってました。お湯も少し白くて温泉みたいでしたよ？'
        )
      )
      .then((translation) => {
        expect(translation).to.equal(
          '喂,今天是柚子的浴盐进入了。好像也有点白温泉热水吗?'
        )
      })
  }).timeout(5000)
})
