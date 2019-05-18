const guiState: yuki.GuiState = {
  noGame: false
}

const mutations = {
  SET_NO_GAME (state: yuki.GuiState, payload: { value: boolean }) {
    state.noGame = payload.value
  }
}

export default {
  state: guiState,
  mutations
}
