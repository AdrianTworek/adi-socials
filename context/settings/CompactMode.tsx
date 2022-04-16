import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'

interface CompactModeContextProps {
  children: ReactNode | ReactNode[]
}

type CompactModeContextType = {
  compactMode: boolean
  setCompactMode: Dispatch<SetStateAction<boolean>>
}

const CompactModeContext = createContext<CompactModeContextType>({
  compactMode: false,
  setCompactMode: () => {},
})

let firstRender = true

export const CompactModeContextProvider = ({
  children,
}: CompactModeContextProps) => {
  const [compactMode, setCompactMode] = useState<boolean>(false)

  useEffect(() => {
    if (firstRender) {
      setCompactMode(localStorage.compactMode === 'true' ? true : false)
      firstRender = false
    }

    if (compactMode) {
      localStorage.compactMode = 'true'
      document.querySelector('html')!.style.fontSize = '85%'
    } else {
      localStorage.compactMode = 'false'
      document.querySelector('html')!.style.fontSize = '100%'
    }
  }, [compactMode])

  return (
    <CompactModeContext.Provider value={{ compactMode, setCompactMode }}>
      {children}
    </CompactModeContext.Provider>
  )
}

const useCompactModeContext = () => useContext(CompactModeContext)

export default useCompactModeContext
