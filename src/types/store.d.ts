declare interface Texts {
  [num: number]: string[]
}

declare interface HooksState {
  hookInfos: TextThread[]
  texts: Texts
  currentDisplayHookIndex: number
}

declare interface HooksMutations {
  ADD_HOOK: (state: HooksState, payload: { hook: TextThread }) => void
  REMOVE_HOOK: (state: HooksState, payload: { hook: TextThread }) => void
  SET_HOOK_TEXT: (state: HooksState, payload: { hookNum: number, text: string }) => void
  CHOOSE_HOOK_AS_DISPLAY: (state: HooksState, payload: { hookNum: number }) => void
}

declare interface ConfigState {
  default: Object
  games: Object
}

declare interface ConfigMutations {
  SET_CONFIG: (state: ConfigState, payload: { name: string, cfgs: Object }) => void
}