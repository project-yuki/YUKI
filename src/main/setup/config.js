import { dialog } from 'electron'
import fs from 'fs'
import yaml from 'js-yaml'
import logger from '../../common/logger'


let config = null

function load() {
  try {
    config = yaml.safeLoad(fs.readFileSync('config/config.yml', 'utf8'))
    logger.debug(`config loaded: `)
    logger.debug(config)
  } catch (e) {
    dialog.showErrorBox('配置文件载入失败', '请确认config/config.yml文件存在')
    process.exit(1)
  }
}

function get() {
  return config
}

function set(cfg) {
  config = Object.assign({}, config, cfg)
}

export default {
  load,
  get,
  set
}