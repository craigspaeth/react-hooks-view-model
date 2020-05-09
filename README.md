# React Hooks View Model

A library that makes it easy to model global state changes with reducer-like functions using React Hooks.

## Motivation

In a sufficiently complex React app one might encounter any number of the following concerns around state management:

- Lifecycle changes like componenDidMount that update state
- Async updates to state e.g. fetching data to render from an API
- Computing values from state often called "selectors" or "derived state"
- Sharing state across components without tons of props boilerplate
- Hard to compose and test business logic around state

Often the solution to this problem is introducing Redux, with a number of additional libraries like Redux-Thunk, Reselect, etc. The basic value prop of this set up is that you can now easily write testable/composable pure functions that can easily share the same piece of global state.

However this value props comes with an opinionated architecture that encourages patterns like writing switch statements which must be careful to return immutable data, decomposing functons across sub-branches of state, the reducer/action creator split, provider components and dispatch, etc. The result of this architecture often leads to unecessary boilerplate and exposing the logic around state changes in unobvious ways.

React Hooks has gone a long way towards making it easy to use all functional patterns for components and local state, but it doesn't provide the benefit Redux does of a simple shared global state and patterns for encouraging writing code in pure functions.

This library providers a number of wrapper functions around React Hooks that covers all of the concerns above in a way that encourages pure functions and a simple single global state object.

## Example

Define your view model

````javascript
import {
  componentDidMount,
  define,
  reducer,
  selector
} from 'react-hooks-view-model'

// Intialize state with props from a top-level component
export const initialState = (props) => ({
  loading: false,
  page: 0,
  todos: []
})

// Write easy to test/compose state-in-state-out reducers
export const addTodo = (state, todoStr) => ({
  ...state,
  todos: state.todos.concat({ text: todoStr, completed: false })
})

export const loading = (state) => ({
  ...state,
  loading: true
})

export const doneLoading = (state) => ({
  ...state,
  loading: false
})

// You can also write "async reducers" that remove state update boilerplate
export const fetchTodos = async (state, page = 1) => {
  const todos = await fetch(`/api/todo?page=${page}`)

  // You're always welcome to compose these from other pure reducer functions
  return todos.reduce((s, t) => addTodo(s, t), state)
}

// Write easy to test/compose selectors that return values from derived state
export const completedTodos = (state) =>
  state.todos.filter((todo) => todo.completed)

export const incompleteTodos = (state) =>
  state.todos.filter((todo) => !todo.completed)

// Certain common effects can be encapsulated as reducer-like functions too
export const initLoading = (state) =>
  loading(state)

export const initTodos = async (state) => {
  const newState = await fetchTodos(state)
  return doneLoading(newState)
}

export default define(initialState, {
  addTodo: reducer(addTodo),
  fetchTodos: reducer(fetchTodos),
  completedTodos: selector(completedTodos),
  incompleteTodos: selector(incompleteTodos),
  initLoading: componentDidMount(initLoading),
  initTodos: componentDidMount(initTodos)
})
````

Initialize the model at the top-level component and wrap with the <Provider />. Then use the model call the wrapped functions to make state updates

````javascript
import todoModel from './view-model'

const TodoList = () => {
  const { completedTodos, incompleteTodos, Provider } = todoModel.use()

  return <ul>
    {completedTodos().map(todo =>
      <li><strike>{todo}</strike></li>
    )}
    {incompleteTodos().map(todo =>
      <li>{todo}</li>
    )}
  </ul>
}

const Todos = (props) => {
  const {
    addTodo,
    fetchTodos,
    initLoading,
    initTodos,
    state
  } = todoModel.use()

  initLoading()
  initTodos()

  return
    <div>
      {state.loading ? 'Loading...' : <TodoList />}
      <button onClick={() => addTodo('Pick up milk')}>
        Add milk todo
      </button>
      <button onClick={() => fetchTodos(state.page + 1)}>
        Load more
      </button>
    </div>

}

const Main = () => {
  const Provider = todoModel.init(props)
  return <Provider><Todos></Provider>
}
````
