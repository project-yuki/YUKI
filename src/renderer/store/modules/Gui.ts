const MAX_DEBUG_MESSAGES_COLUMNS = 1000

const guiState: yuki.GuiState = {
  noGame: false,
  debugMessages: [],
  isGameStartingEnded: false,
  processes: []
}

const getters = {
  getProcessesWithText: (state: yuki.GuiState) => () => {
    const processesWithText: yuki.Processes = [...state.processes];
    (processesWithText as yuki.ProcessesWithText).forEach((value) => {
      value.text = `${value.pid} - ${value.name}`
    })
    return processesWithText
  }
}

const mutations = {
  SET_NO_GAME (state: yuki.GuiState, payload: { value: boolean }) {
    state.noGame = payload.value
  },
  NEW_DEBUG_MESSAGE (state: yuki.GuiState, payload: { value: string }) {
    state.debugMessages.push(payload.value)
    if (state.debugMessages.length > MAX_DEBUG_MESSAGES_COLUMNS) {
      state.debugMessages.shift()
    }
  },
  SET_GAME_STARTING_ENDED (state: yuki.GuiState, payload: { value: boolean }) {
    state.isGameStartingEnded = payload.value
  },
  SET_PROCESSES (state: yuki.GuiState, payload: { value: yuki.Processes }) {
    state.processes = payload.value
  }
}

export default {
  state: guiState,
  mutations,
  getters
}
