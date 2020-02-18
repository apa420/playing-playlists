"use strict";
var API = chrome || browser;

import {storageGet, storageSet, storageRemove, tabsQuery} from "../modules/wrapper.js";
import {newPlaylist, tableCreate, tableDelete, tableUpdate,
  addPlaylistEntry, playlistSelectionPopulate, playlistSelectorAdd,
  playlistRename, playlistDelete} from "../modules/table.js"


function createEmbed(url) {
  var body = document.getElementById("embed");
  var iframe = document.createElement("iframe");
  iframe.setAttribute("src", url);
  iframe.setAttribute("width", "100%");
  iframe.setAttribute("height", "720");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allow", "autoplay; controls; encrtypted-media; picture-in-picture; allowfullscreen");
  body.appendChild(iframe);
}

function createNicoEmbed(url) {
  var body = document.getElementById("embed");
  var iframe = document.createElement("iframe");
  iframe.setAttribute("width", "100%");
  iframe.setAttribute("height", "720");
  iframe.setAttribute("src", url);
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("frameborder", "no");
  body.appendChild(iframe);
}

playlistSelectionPopulate().then(() => {
  tableCreate();
});

//createEmbed("https://github.com/apa420");
//createEmbed("https://www.youtube.com/embed/r9NGooYSeXU?autoplay=1");
// doesn't work
// createEmbed("https://www.youtube.com/embed/r9NGooYSeXU");
createNicoEmbed("http://embed.nicovideo.jp/watch/sm2057168")
//createNicoEmbed("http://ext.nicovideo.jp/thumb_watch/sm2057168");
//createNicoEmbed("http://embed.nicovideo.jp/watch/sm2057168/script?w=640&h=360")
