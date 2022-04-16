import { ChangeEvent } from 'react'

export default (e: ChangeEvent<any>, setSelectedFile: any) => {
  const reader = new FileReader()
  if (e.target.files[0]) {
    reader.readAsDataURL(e.target.files[0])
  }

  reader.onload = (readerEvent: any) => {
    setSelectedFile(readerEvent.target.result)
  }
}
