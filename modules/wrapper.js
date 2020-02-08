"use strict";
var API = chrome || browser;

function wrap(f, thisObj = null) {
  if (chrome) {
    return (key, cb) => f.call(thisObj, key, cb);
  } else {
    return (key, cb) => f.call(thisObj, key).then(cb);
  }
}

export let storageGet = wrap(API.storage.local.get, API.storage.local);
export let storageSet = wrap(API.storage.local.set, API.storage.local);
export let storageRemove = wrap(API.storage.local.remove, API.storage.local);
export let tabsQuery = wrap(API.tabs.query, API.tabs);
