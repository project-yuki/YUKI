import Config from './Config'

export default class GamesConfig extends Config {
  public getFilename (): string {
    return 'games'
  }

  public get () {
    return this.config.games
  }

  public set (cfg: any) {
    this.config.games = cfg
    this.save()
  }

  protected getDefaultObject (): { games: yuki.Config.Games } {
    return { games: [] }
  }
}
