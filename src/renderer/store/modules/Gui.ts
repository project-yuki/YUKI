const state: Yagt.GuiState = {
  noGame: false
};

const mutations = {
  SET_NO_GAME(state: Yagt.GuiState, payload: { value: boolean }) {
    state.noGame = payload.value;
  }
};

export default {
  state,
  mutations
};
