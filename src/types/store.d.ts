declare interface HooksState {
  hookInfos: TextThread[];
  texts: {
    [num: number]: string[];
  };
  currentDisplayHookIndex: number;
}

declare interface ConfigState {
  default: any;
  games: any;
}
