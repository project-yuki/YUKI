import Vue from 'vue'
import GamePage from '@/components/GamesPage'

describe('GamesPage.vue', () => {
  it('renders correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(GamePage)
    }).$mount()

    expect(vm.$el.querySelector('.app-header').textContent).to.contain('我的游戏')
  })
})
