import Vue from 'vue'
import GamePage from '@/components/GamesPage'

describe('LandingPage.vue', () => {
  it('renders correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(GamePage)
    }).$mount()

    expect(vm.$el.querySelector('.header').textContent).to.contain('我的游戏')
  })
})
