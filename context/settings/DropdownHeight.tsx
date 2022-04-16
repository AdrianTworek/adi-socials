import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'

interface DropdownHeightContextProps {
  children: ReactNode | ReactNode[]
}

type DropdownHeightContextType = {
  height: number | null
  setHeight: Dispatch<SetStateAction<null>>
}

const DropdownHeightContext = createContext<DropdownHeightContextType>({
  height: null,
  setHeight: () => {},
})

export const DropdownHeightContextProvider = ({
  children,
}: DropdownHeightContextProps) => {
  const [height, setHeight] = useState(null)

  return (
    <DropdownHeightContext.Provider value={{ height, setHeight }}>
      {children}
    </DropdownHeightContext.Provider>
  )
}

const useDropdownHeightContext = () => useContext(DropdownHeightContext)

export default useDropdownHeightContext
