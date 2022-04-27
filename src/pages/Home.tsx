import { useInitialData } from 'hooks/use-initial-data'
import './Home.css'

const Home: SSRPage<{ data: any[] }> = (props) => {
  if (!props.loaded) {
    return <span>Loading Data...</span>
  }
  const { data } = useInitialData()
  return (
    <>
      <h1>Home</h1>
      <p>initialData: {data.username}</p>
      <ul>
        {props.data.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </>
  )
}

Home.loadData = async function (ctx) {
  return {
    data: [1, 2, 3, 4],
  }
}

export default Home
