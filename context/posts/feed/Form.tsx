import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'

interface FormContextProps {
  children: ReactNode | ReactNode[]
}

type FormContextType = {
  text: string | undefined
  selectedFile: string | undefined
  loading: boolean
  currentPost: string
  isEdit: boolean
  setText: Dispatch<SetStateAction<string | undefined>>
  setSelectedFile: Dispatch<SetStateAction<string | undefined>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setCurrentPost: Dispatch<SetStateAction<string>>
  setIsEdit: Dispatch<SetStateAction<boolean>>
}

const FormContext = createContext<FormContextType>({
  text: '',
  selectedFile: undefined,
  loading: false,
  currentPost: '',
  isEdit: false,
  setText: () => {},
  setLoading: () => {},
  setSelectedFile: () => {},
  setCurrentPost: () => {},
  setIsEdit: () => {},
})

export const FormContextProvider = ({ children }: FormContextProps) => {
  const [text, setText] = useState<string | undefined>('')
  const [selectedFile, setSelectedFile] = useState<string | undefined>(
    undefined
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPost, setCurrentPost] = useState<string>('')
  const [isEdit, setIsEdit] = useState<boolean>(false)

  return (
    <FormContext.Provider
      value={{
        text,
        setText,
        selectedFile,
        setSelectedFile,
        loading,
        setLoading,
        currentPost,
        setCurrentPost,
        isEdit,
        setIsEdit,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

const useFormContext = () => useContext(FormContext)

export default useFormContext
