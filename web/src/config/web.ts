const protocol = import.meta.env.PROD ? 'https' : 'http';
export const WEB_HTTP_URL = `${protocol}://${window.location.host}`;
