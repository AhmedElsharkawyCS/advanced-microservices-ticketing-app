import axios from "axios"
import { isServer } from "@utils"
export default (props) => {
  if (isServer()) {
    return axios.create({ baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local", headers: props?.req.headers })
  }
  return axios.create()
}
