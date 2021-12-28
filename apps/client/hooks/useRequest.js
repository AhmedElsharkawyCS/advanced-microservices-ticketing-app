import { useState } from "react"
import axiosBuilder from "@api/axiosBuilder"
export function useRequest({ method, url, onSuccess }) {
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const resetError = () => {
    if (errors?.length > 0) setErrors(null)
  }
  const doRequest = async (data) => {
    try {
      resetError()
      setLoading(true)
      const client = axiosBuilder()
      const res = await client({
        url,
        method,
        data,
      })
      setLoading(false)
      if (typeof onSuccess === "function") onSuccess(res.data)
      return res.data
    } catch (err) {
      console.log(err)
      const defaultErr = [{ message: "Something went wrong, try again." }]
      setErrors(err.response?.data?.errors || defaultErr)
      setLoading(false)
    }
  }
  return { errors, doRequest, resetError, loading }
}
