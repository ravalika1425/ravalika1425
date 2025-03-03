# Redux Toolkit Usage Guide

This guide provides an overview of how to use Redux Toolkit within the `react-boilerplate` project. It covers the setup of the store, reducers, and how to interact with the state in a React component.

## Store Setup

The Redux store is configured and created in `store.ts` using Redux Toolkit's `configureStore` method. This method simplifies store setup and automatically configures the Redux DevTools extension.

Reducers are a crucial part of the Redux ecosystem. They specify how the application's state changes in response to actions sent to the store. In the `react-boilerplate` project, reducers are defined using Redux Toolkit's `createSlice` method, which simplifies the reducer creation process by automatically generating action creators and action types.

For example, in the `sampleReducer` file, a slice for a sample feature is created with an initial state and a reducer function for the `increment` action. This function updates the `value` property in the state, demonstrating a simple state update pattern.

To use these reducers, they are combined into a single root reducer using Redux Toolkit's `combineReducers` method, as shown in the `reducers/index.ts` file. This root reducer is then passed to the `configureStore` method in `store.ts` to create the Redux store.

Interacting with the state in React components is done using the `useSelector` hook to access the current state and the `useDispatch` hook to dispatch actions. For instance, in the `Login.tsx` component, the `useSelector` hook is used to access the `count` state from the `sample` slice, and the `useDispatch` hook is used to dispatch the `increment` action.

This setup provides a scalable and maintainable structure for managing state in the `react-boilerplate` project, leveraging Redux Toolkit's features for efficient Redux development.
