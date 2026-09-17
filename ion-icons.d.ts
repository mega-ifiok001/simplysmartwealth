// Type declarations for the Ionic `ion-icon` web component used by the
// about/contact pages of the original template.
import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          name?: string;
          src?: string;
          role?: string;
          "aria-label"?: string;
        },
        HTMLElement
      >;
    }
  }
}
