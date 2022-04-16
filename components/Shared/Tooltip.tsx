import { FC, useState, useEffect } from 'react'

interface Props {
  text: string
  position?: 'top' | 'bottom'
}

const positions = {
  top: '-top-10 left-[50%]',
  bottom: 'top-10 left-[50%]',
}

const Tooltip: FC<Props> = ({ text, position }) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  useEffect(() => {
    const handler = setTimeout(() => setShowTooltip(true), 250)

    return () => {
      clearTimeout(handler)
    }
  })

  return (
    <>
      {showTooltip && (
        <div
          className={`text-sm absolute ${
            (position && positions[position]) || 'top-12 left-[50%]'
          } translate-x-[-50%] dark:bg-gray-300 p-1.5
          bg-gray-800 dark:text-gray-800 text-gray-300 rounded-lg opacity-75 z-50`}
        >
          {text}
        </div>
      )}
    </>
  )
}

export default Tooltip
