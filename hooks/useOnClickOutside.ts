import { useEffect } from 'react'

const useOnClickOutside = (ref: any, handler: any) => {
  useEffect(() => {
    const listener = (e: any) => {
      if (!ref.current || ref.current.contains(e.target)) return

      handler(e)
    }

    document.addEventListener('mouseup', listener)

    return () => {
      document.removeEventListener('mouseup', listener)
    }
  }, [ref, handler])
}

export default useOnClickOutside
