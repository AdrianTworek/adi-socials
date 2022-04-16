import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from 'react'
import { useRouter } from 'next/router'

interface ActiveSectionsProps {
  children: ReactNode | ReactNode[]
}

type ActiveSectionsType = {
  activeIcon: string
  setActiveIcon: Dispatch<SetStateAction<string>>
  currentPage: string
  setCurrentPage: Dispatch<SetStateAction<string>>
}

const ActiveSectionsContext = createContext<ActiveSectionsType>({
  activeIcon: 'Home',
  setActiveIcon: () => {},
  currentPage: '',
  setCurrentPage: () => {},
})

export const ActiveSectionsContextProvider = ({
  children,
}: ActiveSectionsProps) => {
  const [activeIcon, setActiveIcon] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<string>('Home')

  const router = useRouter()

  useEffect(() => {
    if (router.pathname === '/') {
      setCurrentPage('Home')
    } else if (router.pathname.includes('groups')) {
      setCurrentPage('Groups')
    } else if (router.pathname.includes('cryptocurrencies')) {
      setCurrentPage('Cryptocurrencies')
    } else {
      setCurrentPage('')
    }
  }, [router.pathname, setCurrentPage])
  return (
    <ActiveSectionsContext.Provider
      value={{
        activeIcon,
        setActiveIcon,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </ActiveSectionsContext.Provider>
  )
}

const useActiveSectionsContext = () => useContext(ActiveSectionsContext)

export default useActiveSectionsContext
