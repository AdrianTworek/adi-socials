import {
  FaGamepad,
  FaHeadset,
  FaReadme,
  FaFilm,
  FaGlobeAmericas,
  FaMusic,
} from 'react-icons/fa'
import { MdSportsSoccer } from 'react-icons/md'
import { GiNightSleep } from 'react-icons/gi'
import { AiFillCamera } from 'react-icons/ai'

const hobbiesData = [
  {
    text: 'Video Games',
    icon: <FaGamepad />,
  },
  {
    text: 'Listening to Music',
    icon: <FaHeadset />,
  },
  {
    text: 'Reading',
    icon: <FaReadme />,
  },
  {
    text: 'Watching Movies',
    icon: <FaFilm />,
  },
  {
    text: 'Football',
    icon: <MdSportsSoccer />,
  },
  {
    text: 'Travelling',
    icon: <FaGlobeAmericas />,
  },
  {
    text: 'Sleeping',
    icon: <GiNightSleep />,
  },
  {
    text: 'Dance',
    icon: <FaMusic />,
  },
  {
    text: 'Photography',
    icon: <AiFillCamera />,
  },
]

export const iconsMap = {
  'Video Games': <FaGamepad />,
  'Listening to Music': <FaHeadset />,
  Reading: <FaReadme />,
  'Watching Movies': <FaFilm />,
  Football: <MdSportsSoccer />,
  Travelling: <FaGlobeAmericas />,
  Sleeping: <GiNightSleep />,
  Dance: <FaMusic />,
  Photography: <AiFillCamera />,
}

export default hobbiesData
