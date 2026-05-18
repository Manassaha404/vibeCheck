import React from 'react'
import { api } from '../trpc/server'

const page = async() => {
  const responce = await api.health.getHealth.query()
  return (
    <div>{responce}</div>
  )
}

export default page;