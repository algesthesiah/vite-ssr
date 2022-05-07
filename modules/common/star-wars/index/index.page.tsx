import React from 'react'
import { t } from '@lingui/macro'
import type { Movie, MovieDetails } from '../types'

export { Page }
// export { onBeforeRender }

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
  return new Promise((resole, reject) => {
    resole([
      {
        id: '1',
        title: '123',
        release_date: '333',
        director: '333',
        producer: '333',
      },
    ])
  })
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

function Page({ movies }: { movies: Movie[] }) {
  const b = 22
  return (
    <>
      <h1>Star Wars Movies1</h1>
      <ol>
        {movies.map(({ id, title, release_date }) => (
          <li key={id}>
            <a href={`/star-wars/${id}`}>{title}</a> ({release_date})
          </li>
        ))}
      </ol>
      <p>
        Source:
        <a href="https://star-wars.brillout.com">star-wars.brillout.com</a>.
      </p>
      <p>
        Data can be fetched by using the <code>onBeforeRender()</code> hook.
      </p>
      <div>{t`indexpage${b}`}</div>
    </>
  )
}
