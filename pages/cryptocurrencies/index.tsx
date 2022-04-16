import { ChangeEvent, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { getProviders, getSession } from 'next-auth/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { Coin } from '../../types/coin'

import { Guest, Layout, Sidebar, CoinCard } from '../../components'

const Cryptocurrencies = ({
  coins,
  providers,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!session) return <Guest providers={providers} />

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>(coins)

  const { t } = useTranslation('common')

  const filterCoins = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSearchTerm(value)

    const filteredCoins = coins.filter(
      (coin: Coin) =>
        coin.name.toLowerCase().includes(value.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(value.toLowerCase())
    )

    setFilteredCoins(filteredCoins)
  }

  return (
    <Layout>
      <Sidebar />
      <Head>
        <title>{t('cryptocurrencies')} | adiSocials</title>
      </Head>
      <div className="flex justify-center xl:justify-start xl:ml-[21rem] mt-8 overflow-x-hidden">
        <input
          type="text"
          className="w-[13rem] text-gray-800 dark:text-gray-200 bg-transparent py-3 border-b-2 border-gray-400 
          dark:border-gray-500 focus:border-pink-400 dark:focus:border-pink-400 outline-none transition-all"
          placeholder={t('search')}
          value={searchTerm}
          onChange={(e) => filterCoins(e)}
        />
      </div>
      <div
        className="xl:max-w-[calc(97vw-20rem)] xl:ml-[20rem] flex 
        gap-6 2xl:gap-8 mt-8 px-4 pb-[7rem] justify-center xl:justify-start flex-wrap w-full"
      >
        {filteredCoins.map((coin: Coin) => (
          <CoinCard key={coin.uuid} coin={coin} />
        ))}
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const session = await getSession(context)

  const res = await fetch(
    'https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers=1&orderBy=marketCap&orderDirection=desc&limit=100&offset=0',
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.NEXT_PUBLIC_RAPIDAPI_CRYPTO_URL!,
        'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_CRYPTO_KEY!,
      },
    }
  )

  const {
    data: { coins },
  } = await res.json()

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      coins,
      providers,
      session,
    },
  }
}

export default Cryptocurrencies
