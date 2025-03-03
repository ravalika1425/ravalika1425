import React from "react"
import Demo from "./components/pages/Demo/Demo"
/**
 * The `App` component serves as the root component of the application.
 * It displays a simple message as part of a React starter kit.
 *
 * @component
 * @example
 * return <App />;
 */

const App = () => {
  return (
    <>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Welcome to React Starter Kit!</h1>
      </div>
      <Demo />
    </>
  )
}

export default App
