import { expect } from 'chai'
import ExternalApi from '../../../../src/main/translate/ExternalApi'

describe('ExternalApi', () => {
  before(() => {
    (global as any).__baseDir = __dirname
  })

  it('gets translation from external JS file', (done) => {
    const youdao = new ExternalApi({
      enable: true,
      external: true,
      jsFile: '..\\..\\temp\\youdaoApi.js',
      name: 'youdao'
    })

    youdao.translate(
      '悠真くんを攻略すれば２１０円か。なるほどなぁ…',
      (translation) => {
        expect(translation).to.equal('如果进攻悠真君,210日元?原来如此啊……')
        done()
      }
    )
  }).timeout(5000)

  it('keeps session when request multiple times', (done) => {
    const youdao = new ExternalApi({
      enable: true,
      external: true,
      jsFile: '..\\..\\temp\\youdaoApi.js',
      name: 'youdao'
    })

    youdao.translate(
      '悠真くんを攻略すれば２１０円か。なるほどなぁ…',
      (translation1) => {
        expect(translation1).to.equal('如果进攻悠真君,210日元?原来如此啊……')
        youdao.translate(
          'はいっ、今日は柚子の入浴剤が入ってました。お湯も少し白くて温泉みたいでしたよ？',
          (translation2) => {
            expect(translation2).to.equal(
              '喂,今天是柚子的浴盐进入了。好像也有点白温泉热水吗?'
            )
            done()
          }
        )
      }
    )
  }).timeout(5000)
})
