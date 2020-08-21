import React, { createContext, useContext, useReducer } from 'react'

const TehcContext = createContext(null)

export function TechHoc(Comp) {
  return () => (
    <TehcContext.Consumer>
      {([state, dispatch]) => {
        return <Comp state={state} dispatch={dispatch} />
      }}
    </TehcContext.Consumer>
  )
}

function reducer(_, actions) {
  switch (actions.type) {
    case 'setState':
      return actions.payload
    default:
      throw new Error()
  }
}

export function TehcProvider({ value, children }) {
  if (!value) {
    throw new Error(`
    You need to add a value: 
      <Tehc value={{ state: "here", reducer: "optional }}>...</Tehc>
    `)
  }

  if (value.state !== 0 && !value.state) {
    throw new Error(`
    You need to add state: 
      <Tehc value={{ state: "goes-here" }}>...</Tehc>
    `)
  }

  const initReducer = value.reducer || reducer
  const [state, dispatch] = useReducer(initReducer, value.state)

  return (
    <TehcContext.Provider value={[state, dispatch]}>
      {children}
    </TehcContext.Provider>
  )
}

export function useTehc() {
  const [context, dispatch] = useContext(TehcContext)
  if (!context) {
    throw new Error(`Wrap your component inside <TechProvider>…</TechProvider>`)
  }

  function handleDispatch(args) {
    if (typeof args === 'string') {
      return dispatch({ type: 'setState', payload: args })
    }

    if (typeof args === 'function') {
      return dispatch({ type: 'setState', payload: args(context) })
    }

    if (args.payload) {
      return dispatch({ type: args.type, payload: args.payload })
    }

    return dispatch({ type: args.type, payload: args.payload })
  }
  return [context, handleDispatch]
}
