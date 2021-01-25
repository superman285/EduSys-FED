import {AxiosStatic} from "axios";

declare module 'axios' {
  const axios: AxiosStatic;
  export default axios;
}

