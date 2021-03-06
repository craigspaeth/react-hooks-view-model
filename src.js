import _ from 'lodash'
import { useGlobal, createProvider } from 'reactn'
import React from 'react'

export const reducer = fn => (state, setState) => {
  if (_.isArray(fn)) {
    return async (...args) => {
      let chainedState = state
      for (const subFn of fn) {
        chainedState = await reducer(subFn)(chainedState, setState)(...args)
      }
      return state
    }
  } else
    return async (...args) =>
      new Promise(resolve => {
        setTimeout(async () => {
          console.debug(`View model updating #${fn.name}...`, { ...state }, fn)
          const newState = await fn(state, ...args)
          console.debug(`View model updated #${fn.name}`, { ...newState }, fn)
          if (!_.isEqual(_.keys(state), _.keys(newState))) {
            console.warn(
              'Component not re-rendering? Ensure adding new keys to initial state.'
            )
          }
          setState(newState)
          resolve(newState)
        })
      })
}

export const selector = fn => state => (...args) => {
  return fn(state, ...args)
}

export const define = (initialState, defintion) => {
  let initialized = false
  return {
    init (props) {
      const Provider = createProvider(initialState(props))
      return ({ children }) => {
        initialized = true
        return React.createElement(Provider, null, children)
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
