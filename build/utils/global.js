import { UAParser } from 'ua-parser-js';
import { variableTypeDetection } from './is';
export const isBrowserEnv = variableTypeDetection.isWindow(typeof window !== 'undefined' ? window : 0);
/**
 * 获取全局变量
 *
 * ../returns Global scope object
 */
export function getGlobal() {
  if (isBrowserEnv) return window;
}
const _global = getGlobal();
const _support = getGlobalMitoSupport();
export { _global, _support };

const uaResult = new UAParser().getResult();

// 获取设备信息
_support.deviceInfo = {
  // 浏览器版本号 107.0.0.0
  browser_version: uaResult.browser.version,
  // Chrome
  browser: uaResult.browser.name,
  // 电脑系统 10
  os_version: uaResult.os.version,
  // Windows
  os: uaResult.os.name,
  ua: uaResult.ua,
  device: uaResult.device.model ? uaResult.device.model : 'Unknow',
  // pc
  device_type: uaResult.device.type ? uaResult.device.type : 'Pc'
};

_support.replaceFlag = _support.replaceFlag || {};
const replaceFlag = _support.replaceFlag;
export function setFlag(replaceType, isSet) {
  if (replaceFlag[replaceType]) return;
  replaceFlag[replaceType] = isSet;
}
export function getFlag(replaceType) {
  return replaceFlag[replaceType] ? true : false;
}
/**
 * 获取全部变量__MITO__的引用地址
 *
 * ../returns global variable of MITO
 */
export function getGlobalMitoSupport() {
  _global.__MITO__ = _global.__MITO__ || {};
  return _global.__MITO__;
}
export function supportsHistory() {
  // NOTE: in Chrome App environment, touching history.pushState, *even inside
  //       a try/catch block*, will cause Chrome to output an error to console.error
  // borrowed from: https://github.com/angular/angular.js/pull/13945/files
  const chrome = _global.chrome;
  // tslint:disable-next-line:no-unsafe-any
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  const hasHistoryApi = 'history' in _global && !!_global.history.pushState && !!_global.history.replaceState;
  return !isChromePackagedApp && hasHistoryApi;
}