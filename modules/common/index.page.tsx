import React from 'react'
import { Button } from 'react-vant'
import { t } from '@lingui/macro'

export { Page }

function Page() {
  return <Button type="primary">{t`hello`}</Button>
}
