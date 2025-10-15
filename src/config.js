const raw = import.meta.env.VITE_API_URL || '';
const apiUrl = raw && raw.endsWith('/') ? raw : `${raw}/`;
const alertTimeBeforeRemove = Number(import.meta.env.VITE_ALERT_TIME ?? 5);

export { apiUrl, alertTimeBeforeRemove };
export default { apiUrl, alertTimeBeforeRemove };
