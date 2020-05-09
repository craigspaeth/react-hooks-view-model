import { define, reducer } from '../'
import { renderToString } from 'react-dom/server'
import express from 'express'
import request from 'superagent'
import React from 'reactn'

const initialState = ({ name }) => ({
  name
})

const model = define(initialState, {
  init: reducer((state, name) => ({ ...state, name }))
})

const Main = ({ name }) => {
  const { state, init } = model.use()
  init(name)
  return <div>{state.name}</div>
}

const startApp = (port, name) => {
  const app = express()
  const Provider = model.init({ name })
  app.get('/', (_req, res) => {
    res.send(
      renderToString(
        <Provider>
          <Main name={name} />
        </Provider>
      )
    )
  })
  return new Promise((resolve, reject) => {
    const server = app.listen(port, err => {
      err ? reject(err) : resolve(server)
    })
  })
}

test('does not leak state across requests', async () => {
  const app1 = await startApp(1234, 'Jane')
  const app2 = await startApp(4567, 'Jamila')
  await request.get('http://localhost:4567') // Run the reducer once
  const { text: res1 } = await request.get('http://localhost:1234')
  const { text: res2 } = await request.get('http://localhost:4567')
  expect(res1).toContain('Jane')
  expect(res2).toContain('Jamila')
  app1.close()
  app2.close()
})
