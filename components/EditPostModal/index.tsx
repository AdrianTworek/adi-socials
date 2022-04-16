import { FC, useRef } from 'react'

import useOnClickOutside from '../../hooks/useOnClickOutside'

import Input from '../Feed/Input'

interface Props {
  userPage: boolean
  postPage: boolean
  setShowEditModal: Function
}

const EditPostModal: FC<Props> = ({ userPage, postPage, setShowEditModal }) => {
  const modalRef = useRef<HTMLDivElement>()

  useOnClickOutside(modalRef, () => setShowEditModal(false))

  return (
    <div className="fixed z-50 w-full min-h-screen left-0 top-0 flex items-center justify-center">
      <div className="absolute w-full min-h-screen bg-black opacity-75"></div>
      <div
        ref={modalRef}
        className="absolute z-50 min-w-[20rem] bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-3 rounded-md shadow-2xl"
      >
        <Input userPage={userPage} postPage={postPage} />
      </div>
    </div>
  )
}

export default EditPostModal
