import Vue from 'vue'
import Vuex from 'vuex'
const GamesPage = require('@/components/GamesPage.vue').default
import { expect } from 'chai'

describe('GamesPage.vue', () => {
  let vm
  before(() => {
    const store = new Vuex.Store({
      modules: {
        Config: {
          namespaced: true,
          state: {
            games: [
              {
                code: '',
                name: '処女はお姉さまに恋してる３',
                path:
                  'D:\\Program Files\\処女はお姉さまに恋してる３\\処女はお姉さまに恋してる３.exe'
              }
            ]
          }
        }
      }
    })
    vm = new Vue({
      el: document.createElement('div'),
      render: (h) => h(GamesPage),
      store
    }).$mount()
  })

  it('renders correct header', () => {
    expect(vm.$el.querySelector('.app-header').textContent).to.contain(
      '我的游戏'
    )
  })
  it('renders correct game card', () => {
    expect(vm.$el.querySelector('.v-card-title').textContent).to.contain(
      '処女はお姉さまに恋してる３'
    )
    expect(vm.$el.querySelector('.v-card-text').textContent).to.contain(
      'D:\\Program Files\\処女はお姉さまに恋してる３\\処女はお姉さまに恋してる３.exe'
    )
  })
})
