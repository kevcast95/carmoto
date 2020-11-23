import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from '../reducers/rootReducers'
import { loadState, saveState } from '../localStorage/localStorage'
import { throttle } from 'lodash'

const configureStore = () => {
  const persistedState = loadState()
  const store = createStore(rootReducer, persistedState, composeWithDevTools())

  store.subscribe(
    throttle(() => {
      saveState({
				calendar: store.getState().calendar,
      })
    }),
    1000
  )

  return store
}

export default configureStore
