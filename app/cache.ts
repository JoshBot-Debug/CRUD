const CACHE = new Map()

export default function getCache() {
  return {
    set(key: string, value: any) {
      CACHE.set(key, value)
    },
    get(key: string) {
      return CACHE.get(key)
    },
    has(key: string) {
      return CACHE.has(key)
    },
    clear() {
      CACHE.clear()
    }
  }
}