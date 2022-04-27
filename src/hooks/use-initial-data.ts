import { SSRContext } from 'context'
import { useContext } from 'react'

export const useInitialData = () => {
  return useContext(SSRContext).initialData as { data: { username: string } }
}
