import axios from "axios"
import { isServer } from "@utils"
export default ({ req }) => {
  if (isServer()) {
    return axios.create({ baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local", headers: req.headers })
  }
  return axios.create()
}
