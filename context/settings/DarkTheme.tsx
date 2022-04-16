import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'

interface DarkThemeContextProps {
  children: ReactNode | ReactNode[]
}

type DarkThemeContextType = {
  darkTheme: boolean
  setDarkTheme: Dispatch<SetStateAction<boolean>>
}

const DarkThemeContext = createContext<DarkThemeContextType>({
  darkTheme: true,
  setDarkTheme: () => {},
})

let firstRender = true

export const DarkThemeContextProvider = ({
  children,
}: DarkThemeContextProps) => {
  const [darkTheme, setDarkTheme] = useState<boolean>(true)

  useEffect(() => {
    if (firstRender) {
      if (localStorage.theme === 'dark') {
        setDarkTheme(true)
      } else if (localStorage.theme === 'light') {
        setDarkTheme(false)
      }

      if (
        !localStorage.theme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        setDarkTheme(true)
      } else {
        if (localStorage.theme === 'dark') {
          setDarkTheme(true)
        } else if (localStorage.theme === 'light') {
          setDarkTheme(false)
        }
      }

      firstRender = false
    }

    if (darkTheme) {
      localStorage.theme = 'dark'
    } else {
      localStorage.theme = 'light'
    }
  }, [darkTheme])

  return (
    <DarkThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      {children}
    </DarkThemeContext.Provider>
  )
}

const useDarkThemeContext = () => useContext(DarkThemeContext)

export default useDarkThemeContext
