import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getProviders, getSession } from 'next-auth/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import priceAndChangeHelper from '../../utils/priceAndChange'

import { Guest, Layout, Sidebar, CoinChart } from '../../components'

const CoinDetail = ({
  coin,
  coin: {
    name,
    symbol,
    price,
    change,
    marketCap,
    numberOfMarkets,
    numberOfExchanges,
    description,
  },
  history,
  session,
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!session) return <Guest providers={providers} />

  const { formattedPrice, positiveChange } = priceAndChangeHelper(price, change)
  const { t } = useTranslation('common')

  return (
    <Layout>
      <Sidebar />
      <div className="text-gray-800 dark:text-gray-100 mt-12 px-2 mx-auto xl:ml-[22rem] pb-12">
        <h4 className="flex items-center justify-center xl:justify-start gap-3 text-center text-4xl font-semibold leading-3">
          {name} <span className="text-lg">({symbol})</span>
        </h4>

        <div className="max-w-[40rem] grid grid-cols-2 gap-4 mt-10 mx-auto xl:mx-0 text-lg text-gray-700 dark:text-gray-400">
          <p>
            <span className="text-gray-800 dark:text-gray-100 font-medium">
              {t('price')}:
            </span>{' '}
            ${formattedPrice}
          </p>
          <p
            className={`${
              positiveChange
                ? 'text-green-600 dark:text-green-500'
                : 'text-red-500'
            }`}
          >
            <span className="text-gray-800 dark:text-gray-100 font-medium">
              {t('change')}:
            </span>{' '}
            {positiveChange && '+'}
            {change}%
          </p>
          <p>
            <span className="text-gray-800 dark:text-gray-100 font-medium">
              {t('marketCap')}:
            </span>{' '}
            ${marketCap}
          </p>
          <p>
            <span className="text-gray-800 dark:text-gray-100 font-medium">
              {t('volume')}:
            </span>{' '}
            ${coin['24hVolume']}
          </p>
          <p>
            <span className="text-gray-800 dark:text-gray-100 font-medium">
              {t('markets')}:
            </span>{' '}
            {numberOfMarkets}
          </p>
          <p>
            <span className="text-gray-800 dark:text-gray-100 font-medium">
              {t('exchanges')}:
            </span>{' '}
            {numberOfExchanges}
          </p>
        </div>

        <CoinChart data={history} />

        <div
          dangerouslySetInnerHTML={{ __html: description }}
          className="max-w-[50rem] mt-6 mx-auto xl:mx-0 coin-description"
        ></div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const session = await getSession(context)

  const coinResponse = await fetch(
    `https://coinranking1.p.rapidapi.com/coin/${context.params.coinId}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'coinranking1.p.rapidapi.com',
        'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_CRYPTO_KEY,
      },
    }
  )

  const coinHistoryResponse = await fetch(
    `https://coinranking1.p.rapidapi.com/coin/${context.params.coinId}/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'coinranking1.p.rapidapi.com',
        'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_CRYPTO_KEY,
      },
    }
  )

  const {
    data: { coin },
  } = await coinResponse.json()

  const {
    data: { history },
  } = await coinHistoryResponse.json()

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      coin,
      history,
      providers,
      session,
    },
  }
}

export default CoinDetail
