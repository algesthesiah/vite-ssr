import React from 'react'
import { t } from '@lingui/macro'

export { Page }

function Page({ name }: { name: string }) {
  const a = 110
  return (
    <>
      <h1>Hello</h1>
      <p>
        Hi <b>{name}</b>.
      </p>
      <ul>
        <li>
          <a href="/hello/eli">/hello/eli</a>
        </li>
        <li>
          <a href="/hello/jon">/hello/jon</a>
        </li>
      </ul>
      <div>{t`hello${a}`} </div>
    </>
  )
}
