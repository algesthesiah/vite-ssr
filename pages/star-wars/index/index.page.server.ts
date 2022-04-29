import fetch from 'cross-fetch'
import type { Movie, MovieDetails } from '../types'

export { onBeforeRender }

function getTitle(movies: Movie[] | MovieDetails[]): string {
  const title = `${movies.length} Star Wars Movies`
  return title
}
function filterMoviesData(movies: MovieDetails[]): Movie[] {
  return movies.map((movie: MovieDetails) => {
    const { title, release_date, id } = movie
    return { title, release_date, id }
  })
}
async function getStarWarsMovies(): Promise<MovieDetails[]> {
  const response = await fetch('https://star-wars.brillout.com/api/films.json')
  let movies: MovieDetails[] = (await response.json()).results
  movies = movies.map((movie: MovieDetails, i: number) => ({
    ...movie,
    id: String(i + 1),
  }))
  return movies
}
async function onBeforeRender() {
  const movies = await getStarWarsMovies()
  return {
    pageContext: {
      clientFetch: getStarWarsMovies,
      pageProps: {
        // We remove data we don't need because we pass `pageContext.movies` to
        // the client; we want to minimize what is sent over the network.
        movies: filterMoviesData(movies),
      },
      // The page's <title>
      documentProps: { title: getTitle(movies) },
    },
  }
}
