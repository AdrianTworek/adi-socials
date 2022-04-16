import { useState, FC, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { db } from '../../firebase'
import { collection, onSnapshot, query } from 'firebase/firestore'

import { Contact } from '../../types/contact'

import useChatContext from '../../context/chat/Chat'

const Contacts: FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([])

  const { data: session } = useSession()
  const { setShowChat, setChatData } = useChatContext()
  const { t } = useTranslation('common')

  const handleChatWindow = (contact: Contact) => {
    setShowChat(true)
    setChatData({
      id: contact.id,
      userImg: contact.userImg,
      username: contact.username,
    })
  }

  useEffect(() => {
    onSnapshot(
      query(collection(db, 'users', session.user.uid, 'friends')),
      (snapshot) => {
        let contacts = snapshot.docs.map((contact: any) => ({
          id: contact.id,
          ...contact.data(),
        }))
        setContacts(contacts)
      }
    )
  }, [db])

  return (
    <div className="no-scrollbar hidden lg:flex flex-col xl:fixed top-20 right-2 bottom-0 overflow-x-hidden overflow-y-scroll h-[80vh] w-[18rem]">
      <h3 className="text-lg text-gray-600 dark:text-gray-400 font-medium pl-2">
        {t('contacts')}
      </h3>

      <ul className="flex flex-col mt-2">
        {contacts.map((contact: Contact) => (
          <li
            key={contact.id}
            className="flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 
            transition-all rounded-md cursor-pointer"
            onClick={() => handleChatWindow(contact)}
          >
            <img
              src={contact.userImg}
              alt={`${contact.username} picture`}
              className="w-9 h-9 rounded-full"
            />
            <span className="text-gray-700 dark:text-gray-200 font-semibold">
              {contact.username}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Contacts
