import React, { createContext, useContext, useReducer } from "react";

const TehcContext = createContext(null);

export function TehcHoc(Comp) {
  return () => (
    <TehcContext.Consumer>
      {([state, dispatch]) => {
        return (
          <Comp state={state} dispatch={handleDispatch(state, dispatch)} />
        );
      }}
    </TehcContext.Consumer>
  );
}

function reducer(_, action) {
  switch (action.type) {
    case "setState":
      return action.payload;
    default:
      throw new Error();
  }
}

export function TehcProvider({ store, children }) {
  if (!store) {
    throw new Error(`
    You need to add a store: 
      <Tehc store={{ state: "here", reducer: "optional }}>...</Tehc>
    `);
  }

  if (store.state !== 0 && !store.state) {
    throw new Error(`
    You need to add state: 
      <Tehc store={{ state: "goes-here" }}>...</Tehc>
    `);
  }

  const initReducer = store.reducer || reducer;
  const [state, dispatch] = useReducer(initReducer, store.state);

  return (
    <TehcContext.Provider value={[state, dispatch]}>
      {children}
    </TehcContext.Provider>
  );
}

function handleDispatch(context, dispatch) {
  return (args) => {
    if (typeof args === "string") {
      return dispatch({ type: "setState", payload: args });
    }

    if (typeof args === "function") {
      return dispatch({ type: "setState", payload: args(context) });
    }

    if (args.payload) {
      return dispatch({ type: args.type, payload: args.payload });
    }

    return dispatch({ type: args.type, payload: args.payload });
  };
}

export function useTehc() {
  const [context, dispatch] = useContext(TehcContext);
  if (!context) {
    throw new Error(
      `Wrap your component inside <TechProvider>…</TechProvider>`
    );
  }

  return [context, handleDispatch(context, dispatch)];
}
