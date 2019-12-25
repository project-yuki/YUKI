import { screen } from 'electron'
import Config from './Config'

export default class GuiConfig extends Config {
  public getFilename (): string {
    return 'gui'
  }

  protected getDefaultObject (): yuki.Config.Gui {
    const displaySize = screen.getPrimaryDisplay().size
    const mainWindowWidthRatio = 0.75
    const mainWindowHeightRatio = 0.8
    const translatorWindowWidthRatio = 0.65
    const translatorWindowHeightRatio = 0.25

    return {
      mainWindow: {
        bounds: {
          width: Math.trunc(displaySize.width * mainWindowWidthRatio),
          height: Math.trunc(displaySize.height * mainWindowHeightRatio),
          x: Math.trunc(displaySize.width * ((1 - mainWindowWidthRatio) / 2)),
          y: Math.trunc(displaySize.height * ((1 - mainWindowHeightRatio) / 2))
        }
      },
      translatorWindow: {
        bounds: {
          width: Math.trunc(displaySize.width * translatorWindowWidthRatio),
          height: Math.trunc(displaySize.height * translatorWindowHeightRatio),
          x: Math.trunc(
            displaySize.width * ((1 - translatorWindowWidthRatio) / 2)
          ),
          y: Math.trunc(displaySize.height * 0.05)
        },
        alwaysOnTop: true,
        originalText: {
          fontSize: 24,
          color: 'white'
        },
        translationText: {
          fontSize: 18,
          color: 'white',
          margin: 18
        },
        background: '#000000BD',
        renderMode: 'translucent',
        mecab: {
          showRomaji: false
        },
        autoHideTitlebar: false
      }
    }
  }
}
