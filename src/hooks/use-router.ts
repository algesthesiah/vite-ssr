import { useHistory, useLocation, useParams } from 'react-router'

export const useRouter = () => {
  const params = useParams()
  const history = useHistory()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const dict = {}
  query.forEach((value, key) => {
    dict[key] = value
  })
  return {
    ...history,
    ...location,
    query: { ...params, ...dict },
    params: { ...params },
  }
}
