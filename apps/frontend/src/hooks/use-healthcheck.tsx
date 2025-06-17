import { useEffect, useState } from "react"

export function useHealthcheck(url: string, timeout = 3000) {
  const [status, setStatus] = useState<"online" | "offline" | "connecting">("connecting")

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    fetch(url, { signal: controller.signal })
      .then((res) => setStatus(res.ok ? "online" : "offline"))
      .catch(() => setStatus("offline"))
      .finally(() => clearTimeout(timer))

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [url, timeout])

  return status
}
