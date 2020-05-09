import _ from 'lodash'
import { useGlobal, createProvider } from 'reactn'
import React from 'react'

export const reducer = fn => (state, setState) => {
  return (...args) =>
    setTimeout(async () => {
      const newState = await fn(state, ...args)
      if (!_.isEqual(_.keys(state), _.keys(newState))) {
        console.warn(
          'Component not re-rendering? Ensure adding new keys to initial state.'
        )
      }
      setState(newState)
    })
}

export const selector = fn => state => (...args) => {
  return fn(state, ...args)
}

export const componentDidMount = fn => (
  state,
  setState,
  useEffect = React.useEffect
) => (...args) => {
  useEffect(() => {
    reducer(fn)(state, setState)(...args)
  }, [])
}

export const define = (initialState, defintion) => {
  let initialized = false
  return {
    init (props) {
      const Provider = createProvider(initialState(props))
      return ({ children }) => {
        initialized = true
        return React.createElement(
          Provider,
          null,
          children
        )
      }
    },
    use () {
      if (!initialized) throw new Error('Must use <Provider /> from model.init')
      const [state, setState] = useGlobal()
      const api = _.mapValues(defintion, cb => cb(state, setState))
      return { state, ...api }
    }
  }
}
