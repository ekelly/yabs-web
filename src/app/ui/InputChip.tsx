import * as React from "react";
import { createComponent } from "@lit/react";
import { MdInputChip } from "@material/web/chips/input-chip";

export const InputChip = createComponent({
  tagName: "md-input-chip",
  elementClass: MdInputChip,
  react: React,
  // events: {
  //   onactivate: "activate",
  //   onchange: "change",
  // },
});
