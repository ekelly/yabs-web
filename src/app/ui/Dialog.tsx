import * as React from "react";
import { createComponent } from "@lit/react";
import { MdDialog } from "@material/web/dialog/dialog";

export const Dialog = createComponent({
  tagName: "md-dialog",
  elementClass: MdDialog,
  react: React,
  events: {
    // onactivate: "activate",
    // onchange: "change",
    onClose: "close",
  },
});
