// src/utils/version.js
const mode = import.meta.env.MODE
const envLabel = mode === 'development' ? 'local' : mode
export const appVersion = `${__APP_VERSION__}-${envLabel}`
export default appVersion
