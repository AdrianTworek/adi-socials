import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from 'react'

interface ShowSidebarProps {
  children: ReactNode | ReactNode[]
}

type ShowSidebarType = {
  showSidebar: boolean
  setShowSidebar: Dispatch<SetStateAction<boolean>>
}

const ShowSidebarContext = createContext<ShowSidebarType>({
  showSidebar: false,
  setShowSidebar: () => {},
})

export const ShowSidebarContextProvider = ({ children }: ShowSidebarProps) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false)

  useEffect(() => {
    if (window.innerWidth >= 1280) setShowSidebar(true)
  }, [])

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1280) {
        setShowSidebar(true)
      }
    }

    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
  })

  return (
    <ShowSidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </ShowSidebarContext.Provider>
  )
}

const useShowSidebarContext = () => useContext(ShowSidebarContext)

export default useShowSidebarContext
