import { FC } from 'react'
import Link from 'next/link'

import { Coin } from '../../types/coin'

import priceAndChangeHelper from '../../utils/priceAndChange'

interface Props {
  coin: Coin
}

const Coin: FC<Props> = ({
  coin: { uuid, name, symbol, change, price, iconUrl, rank },
}) => {
  const { formattedPrice, positiveChange } = priceAndChangeHelper(price, change)

  return (
    <Link href={`/cryptocurrencies/${uuid}`} passHref>
      <div
        className="w-[17rem] flex flex-col gap-3 px-4 py-3 justify-center 
      bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-gray-700
      hover:bg-gray-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
      >
        <div className="flex gap-2 pb-3 border-b border-gray-300 dark:border-gray-600">
          <img className="w-9 h-9" src={iconUrl} alt={name} />
          <div>
            <h3 className="text-lg font-semibold dark:text-gray-200">{name}</h3>
            <h4 className="text-md font-medium text-gray-500">{symbol}</h4>
          </div>
          <p className="ml-auto text-sm text-gray-500 mr-2">{rank}.</p>
        </div>

        <p className="text-lg tracking-wide font-semibold text-gray-700 dark:text-gray-300">
          ${formattedPrice}
        </p>
        <p
          className={`-mt-3 ${
            positiveChange ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {positiveChange && '+'}
          {change}%
        </p>
      </div>
    </Link>
  )
}

export default Coin
