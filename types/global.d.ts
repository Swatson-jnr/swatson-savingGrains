import { AxiosInstance } from "axios";
import { route as ziggyRoute } from "ziggy-js";

declare global {
  interface Window {
    axios: AxiosInstance;
  }

  var route: typeof ziggyRoute;
}

// declare module "nanoid" {
//   export function nanoid(size?: number): string;
// }
