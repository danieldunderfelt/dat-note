import { app } from 'electron'

export const BASE_PATH = app.getPath('userData') + '/data'
export const DEFAULT_SETTINGS_FILE = BASE_PATH + '/default_settings.json'
export const STORAGE_PATH = BASE_PATH + '/hypercore'

export const V_SETTINGS_FILE = '/settings.json'
export const V_FILES_PATH = '/content'