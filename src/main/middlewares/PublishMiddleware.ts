const debug = require('debug')('yuki:publish')

export default class PublishMiddleware
  implements yuki.Middleware<yuki.TextOutputObject> {
  private subscribers: Electron.WebContents[] = []
  private type: string
  constructor (type: string) {
    this.type = type
  }

  public subscribe (webContents: Electron.WebContents) {
    if (this.subscribers.find((value) => value === webContents)) {
      debug(
        'webContents %s already subscribed type %s',
        webContents.getTitle(),
        this.type
      )
    } else {
      this.subscribers.push(webContents)
      debug(
        'webContents %s successfully subscribed type %s',
        webContents.getTitle(),
        this.type
      )
    }
  }

  public unsubscribe (webContents: Electron.WebContents) {
    if (!this.subscribers.find((value) => value === webContents)) {
      debug(
        'webContents %s has not subscribed type %s',
        webContents.getTitle(),
        this.type
      )
    } else {
      this.subscribers = this.subscribers.filter(
        (subscriber) => subscriber !== webContents
      )
      debug(
        'webContents %s successfully unsubscribed type %s',
        webContents.getTitle(),
        this.type
      )
    }
  }

  public process (context: yuki.TextOutputObject) {
    for (const subscriber of this.subscribers) {
      subscriber.send(this.type, context)
    }
  }
}
