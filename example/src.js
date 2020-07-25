import React from 'react'
import ReactDOM from 'react-dom'
import { define, reducer } from '../src.js'

const initialState = () => ({
  count: 0,
  foo: null
})

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const inc = (state) => ({ ...state, count: state.count + 1 })

const incByTen = async (state) => {
  state = {...state, baz: 'bam'}
  await sleep(5000)
  return { ...state, count: state.count + 10 }
}

const foo = state => ({ ...state, foo: { bar: { baz: [{ bam: 'bop'}]}}})

const model = define(initialState, {
  inc: reducer(inc),
  incByTen: reducer(incByTen),
  foo: reducer(foo)
})

const Body = () => {
  const { state, inc, incByTen, foo } = model.use()
  return (
    <div>
      The count is {state.count}
      <br />
      <button onClick={inc}>+</button> 
      <button onClick={incByTen}>+10</button> 
      <button onClick={foo}>Foo</button> 
    </div>
  )
}

const Main = () => {
  const Provider = model.init()
  return <Provider><Body /></Provider>
}

;(() => {
  ReactDOM.render(
    <Main />,
    document.getElementById('main')
  )
})()