import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import { getProviders, getSession } from 'next-auth/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import img from './working.svg'

import { Guest, Layout, Sidebar } from '../../components'

const Groups = ({
  providers,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!session) return <Guest {...providers} />

  const { t } = useTranslation('common')

  return (
    <Layout>
      <Head>
        <title>{t('groups')} | adiSocials</title>
      </Head>
      <div className="flex w-full">
        <Sidebar />
        <div className="flex flex-col items-center justify-center gap-3 mx-auto p-4">
          <Image src={img} alt="Working icon" width={300} height={300} />
          <h3 className="text-4xl font-thin text-center text-gray-800 dark:text-gray-200">
            This page is underdeveloped...
          </h3>
          <h4 className="text-3xl font-medium text-center text-gray-600 dark:text-gray-400">
            Coming soon
          </h4>
        </div>
      </div>
    </Layout>
  )
}

export default Groups

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const session = await getSession(context)

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      providers,
      session,
    },
  }
}
