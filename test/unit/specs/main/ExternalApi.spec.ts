import { expect } from 'chai'
import ExternalApi from '../../../../src/main/translate/ExternalApi'

describe('ExternalApi', () => {
  before(() => {
    (global as any).__baseDir = __dirname
  })

  it('gets translation from external JS file', (done) => {
    const qq = new ExternalApi({
      enable: true,
      external: true,
      jsFile: '../../temp/qqApi.js',
      name: 'qq'
    })

    qq.translate(
      '悠真くんを攻略すれば２１０円か。なるほどなぁ…',
      (translation) => {
        try {
          expect(translation).to.equal('攻略悠真的话是210日元啊。原来如此啊……')
        } catch (e) {
          return done(e)
        }
        done()
      }
    )
  }).timeout(5000)

  it('keeps session when request multiple times', (done) => {
    const qq = new ExternalApi({
      enable: true,
      external: true,
      jsFile: '../../temp/qqApi.js',
      name: 'qq'
    })

    qq.translate(
      '悠真くんを攻略すれば２１０円か。なるほどなぁ…',
      (translation1) => {
        try {
          expect(translation1).to.equal('攻略悠真的话是210日元啊。原来如此啊……')
          qq.translate(
          'はいっ、今日は柚子の入浴剤が入ってました。お湯も少し白くて温泉みたいでしたよ？',
          (translation2) => {
            try {
              expect(translation2).to.equal(
                '是的，今天放了柚子的沐浴剂。热水也有点白，就像温泉一样呢？'
              )
              done()
            } catch (e) {
              return done(e)
            }
          }
        )
        } catch (e) {
          return done(e)
        }
      }
    )
  }).timeout(5000)
})
