export function sleep(t: number) {
  return new Promise((r) => setTimeout(r, t))
}

export function queryStringToObject(query: any) {
  // @ts-expect-error
  return Object.fromEntries(new URLSearchParams(query)!)
}
