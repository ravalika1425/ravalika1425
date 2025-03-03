import React from "react"
import ReactDOM from "react-dom/client"
import { ThemeProvider, useTheme } from "./contexts/ThemeContext/ThemeContext"
import App from "./App"
import "./assets/themes/play-bootstrap/play-bootstrap-light/play-blue/lightTheme.scss"
import "./assets/themes/play-bootstrap/play-bootstrap-dark/play-blue/darkTheme.scss"

const ThemedApp = () => {
  const { theme } = useTheme()

  return (
    <div className={theme === "light" ? "lightTheme" : "darkTheme"}>
      <App />
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </React.StrictMode>,
)
