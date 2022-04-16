import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from 'react'

interface ShowLanguageModalProps {
  children: ReactNode | ReactNode[]
}

type ShowLanguageModalType = {
  showLanguageModal: boolean
  setShowLanguageModal: Dispatch<SetStateAction<boolean>>
}

const ShowLanguageModalContext = createContext<ShowLanguageModalType>({
  showLanguageModal: false,
  setShowLanguageModal: () => {},
})

export const ShowLanguageModalContextProvider = ({
  children,
}: ShowLanguageModalProps) => {
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false)

  return (
    <ShowLanguageModalContext.Provider
      value={{ showLanguageModal, setShowLanguageModal }}
    >
      {children}
    </ShowLanguageModalContext.Provider>
  )
}

const useShowLanguageModalContext = () => useContext(ShowLanguageModalContext)

export default useShowLanguageModalContext
