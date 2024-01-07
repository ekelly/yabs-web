import * as React from "react";
import { createComponent } from "@lit/react";
import { MdChipSet } from "@material/web/chips/chip-set";

export const ChipSet = createComponent({
  tagName: "md-chip-set",
  elementClass: MdChipSet,
  react: React,
  // events: {
  //   onactivate: "activate",
  //   onchange: "change",
  // },
});
