import React from 'react'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { MovieDetails } from '../types'

export { Page }
export { onBeforeRender }

function Page({ movie }: { movie: MovieDetails }) {
  return (
    <>
      <h1>{movie.title}</h1>
      Release Date: {movie.release_date}
      <br />
      Director: {movie.director}
      <br />
      Producer: {movie.producer}
    </>
  )
}
const af = () => {
  return new Promise((resole, reject) => {
    setTimeout(() => {
      resole({
        id: '1',
        title: '123',
        release_date: '333',
        director: '333',
        producer: '333',
      })
    }, 2000)
  })
}
async function onBeforeRender(pageContext: PageContextBuiltIn) {
  const a = await af()
  let movie = a as MovieDetails

  // We remove data we don't need because we pass `pageContext.movie` to
  // the client; we want to minimize what is sent over the network.

  return {
    pageContext: {
      pageProps: {
        movie,
      },
      documentProps: {
        // The page's <title>
        title: 123,
      },
    },
  }
}
