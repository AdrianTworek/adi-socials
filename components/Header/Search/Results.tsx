import { FC } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

interface Props {
  results: any[]
  setSearchTerm: Function
  setShowResults: Function
  setShowInput: Function
}

const Results: FC<Props> = ({
  results,
  setSearchTerm,
  setShowResults,
  setShowInput,
}) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <>
      {results.length === 0 ? (
        <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium my-2">
          {t('couldNotFindAnything')}
        </h4>
      ) : (
        <div className="no-scrollbar max-h-[27.7rem] overflow-y-scroll">
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center gap-2 text-gray-800 dark:text-gray-300 p-2 transition-all rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer"
              onClick={() => {
                setSearchTerm('')
                setShowInput(false)
                setShowResults(false)
                router.push(`/users/${result.id}`)
              }}
            >
              <img
                src={result?.image}
                alt={`Photo of ${result.name}`}
                className="w-9 h-9 rounded-full"
              />

              <p className="inline-block max-w-[10rem] break-words text-gray-800 dark:text-gray-300 font-semibold">
                {result.name}
              </p>
              {result.id === session.user.uid && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('you')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Results
