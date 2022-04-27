import { createContext } from 'react'

export const SSRContext = createContext<{
  // TODO
  initialData: any
  url: Record<string, Record<'data', any>>
  $ssrErrorMsg?: string
  status?: number
  error?: true
  message?: string
}>({} as any)

const { Provider, Consumer } = SSRContext

export const SSRProvider = Provider
export const SSRConsumer = Consumer
