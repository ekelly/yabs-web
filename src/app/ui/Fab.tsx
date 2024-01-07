import * as React from "react";
import { createComponent } from "@lit/react";
import { MdFab } from "@material/web/fab/fab.js";

export const Fab = createComponent({
  tagName: "md-fab",
  elementClass: MdFab,
  react: React,
  // events: {
  //   onactivate: "activate",
  //   onchange: "change",
  // },
});
