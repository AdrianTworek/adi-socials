import { useEffect } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Me = ({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>): null => {
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push(`/users/${session.user.uid}`)
    } else {
      router.push('/')
    }
  }, [])

  return null
}

export default Me

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      session,
    },
  }
}
