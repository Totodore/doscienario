/**
 * Add a custom-electron-titlebar
 */
import { Color, Titlebar } from "custom-electron-titlebar";

console.log("[Preload] Preload script loaded");
window.addEventListener("DOMContentLoaded", () => {
  console.log("[Preload] Initializing titlebar");
  new Titlebar({
    backgroundColor: Color.fromHex('#272727'),
    icon: __dirname.replace(/\\/g, "/") + "/" + "../icons/icon.png",
    titleHorizontalAlignment: "left",
    shadow: true,
    menu: null,
    overflow: "hidden",
  });
});
