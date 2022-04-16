import { FC, useState, ReactNode } from 'react'

import Tooltip from '../Shared/Tooltip'

interface Props {
  icon: ReactNode
  tooltipText?: string
  tooltipPosition?: 'top' | 'bottom'
  type?: 'button' | 'submit' | 'reset' | undefined
}

const IconButton: FC<Props> = ({
  icon,
  tooltipText,
  tooltipPosition,
  type,
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  return (
    <>
      <button
        type={type}
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {icon}

        {/* Show tooltip when icon is hovered */}
        {showTooltip && tooltipText && (
          <Tooltip text={tooltipText} position={tooltipPosition} />
        )}
      </button>
    </>
  )
}

export default IconButton
