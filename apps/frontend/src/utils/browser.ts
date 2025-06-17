export const isMac = navigator.userAgent.includes('Mac');
export const isSafari = navigator.userAgent.includes('Safari');
export const isFirefox = navigator.userAgent.includes('Firefox');
export const isOpera = navigator.userAgent.includes('OPR');
export const isChrome = navigator.userAgent.includes('Chrome');
export function modifierKeyDown(event: React.MouseEvent) {
  return isMac ? event.metaKey : event.ctrlKey;
}
