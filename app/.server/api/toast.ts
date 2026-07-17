export default {
  success: (title: string, message: string, data: Record<string, any> = {}) => JSON.stringify({
    ...data,
    toast: { title, message, severity: "success" }
  }),
  warning: (title: string, message: string, data: Record<string, any> = {}) => JSON.stringify({
    ...data,
    toast: { title, message, severity: "warning" }
  }),
  error: (title: string, message: string, data: Record<string, any> = {}) => JSON.stringify({
    ...data,
    toast: { title, message, severity: "error" }
  }),
  info: (title: string, message: string, data: Record<string, any> = {}) => JSON.stringify({
    ...data,
    toast: { title, message, severity: "info" }
  })
}
