export { onBeforeRender }

function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('im error')
    }, 300)
  })
}

async function onBeforeRender(pageContext) {
  /** TODO: try catch fetchData can only kill this one error, how to kill this error for global */
  const response = await fetchData()
  return {
    pageContext: {
      pageProps: response,
      documentProps: {
        title: 'home',
      },
    },
  }
}
