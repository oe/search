const cacheKey = {
  bg: '__background_cache__',
  search: '__search_cache__',
  time: '__time_cache__',
}

export function getCache(keyName: keyof typeof cacheKey) {
  try {
    const valStr = localStorage.getItem(cacheKey[keyName])
    return valStr ? JSON.parse(valStr) : undefined
  } catch (error) {
    return
  }
}

export function saveCache(keyName: keyof typeof cacheKey, obj: any) {
  const existing = getCache(keyName)
  localStorage.setItem(cacheKey[keyName], JSON.stringify(Object.assign({}, existing, obj)))
}
