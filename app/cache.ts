const CACHE = new Map()

interface SetOptions { cacheInvalidationTimeout?: number; }

export default function getCache() {
  return {
    set(key: string, value: any, options: SetOptions = {}) {
      CACHE.set(key, { options, timestamp: Date.now(), value })
    },
    get(key: string) {
      this.invalidate();
      return CACHE.get(key).value
    },
    has(key: string) {
      this.invalidate()
      return CACHE.has(key)
    },
    clear() {
      CACHE.clear()
    },
    delete(key: string) {
      return CACHE.delete(key)
    },
    invalidate() {
      const now = Date.now()
      for (const [key, data] of CACHE.entries()) {
        const timeout = data.options.cacheInvalidationTimeout;
        if (typeof timeout === "number")
          if (now > data.timestamp + timeout)
            CACHE.delete(key);
      }
    }
  }
}