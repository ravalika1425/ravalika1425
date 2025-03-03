import React, { createContext, useContext, useState, ReactNode } from "react"

type Theme = "light" | "dark" | "materialLight"
interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light")

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      switch (prevTheme) {
        case "light":
          return "dark"
        case "dark":
          return "materialLight"
        case "materialLight":
          return "light"
        default:
          return "light"
      }
    })
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
