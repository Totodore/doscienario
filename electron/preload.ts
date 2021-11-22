import { Color, Titlebar } from "custom-electron-titlebar";

document.addEventListener("DOMContentLoaded", () => {
  new Titlebar({
    backgroundColor: Color.fromHex('#272727'),
    icon: __dirname.replace(/\\/g, "/") + "/" + "../icons/icon.png",
    titleHorizontalAlignment: "left",
    shadow: true,
    menu: null
  });
});