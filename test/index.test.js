import * as vm from '../src.js'
import reactn from 'reactn'

let state
const setState = newState => {
  state = newState
}

const nextTick = () => new Promise(resolve => setTimeout(resolve))

jest.mock('reactn', () => {
  let state
  const setGlobal = newState => {
    state = newState
  }
  return {
    setGlobal,
    useGlobal: () => [state, setGlobal],
    createProvider: jest.fn().mockReturnValue(null)
  }
})

test('reducer converts a reducer function into state update', async () => {
  state = 0
  vm.reducer(state => state + 1)(state, setState)()
  await nextTick()
  expect(state).toEqual(1)
})

test('selector converts a selector function into derived state', async () => {
  state = 0
  expect(vm.selector(state => state + 1)(state)()).toEqual(1)
})

test('define throws if you dont use the provider', async () => {
  const model = vm.define(() => {})
  model.init()
  expect(() => model.use()).toThrowError(
    new Error('Must use <Provider /> from model.init')
  )
})

test('define converts reducers to callbacks', async () => {
  const initialState = () => ({ count: 0 })
  reactn.setGlobal({ count: 0 })
  const model = vm.define(initialState, {
    add: vm.reducer(state => ({ ...state, count: state.count + 1 }))
  })
  const Provider = model.init()
  Provider({ children: [] })
  await model.use().add()
  expect(model.use().state.count).toEqual(1)
})

test('define converts reducer chains to a callback', async () => {
  const initialState = () => ({ count: 0 })
  reactn.setGlobal({ count: 0 })
  const addOne = state => ({ ...state, count: state.count + 1 })
  const tick = state => Promise.resolve(state)
  const model = vm.define(initialState, {
    tally: vm.reducer([
      addOne,
      tick,
      addOne
    ])
  })
  const Provider = model.init()
  Provider({ children: [] })
  await model.use().tally()
  expect(model.use().state.count).toEqual(2)
})
