import { FC } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type CoinChartData = {
  timestamp: number
  price: string
}

interface Props {
  data: CoinChartData[]
}

const CoinChart: FC<Props> = ({ data }) => {
  data = data.sort((a, b) => a.timestamp - b.timestamp)

  return (
    <div className="max-w-[80rem] mt-8">
      <Line
        data={{
          labels: data.map((coin: CoinChartData) => {
            const date = new Date(coin.timestamp * 1000)

            return date.getHours() < 12
              ? `${date.toLocaleTimeString()} AM`
              : `${date.toLocaleTimeString()} PM`
          }),
          datasets: [
            {
              data: data.map((coin: CoinChartData) => coin.price),
              label: 'Price',
              borderColor: '#db2777',
            },
          ],
        }}
        options={{
          elements: {
            point: {
              radius: 2,
            },
          },
        }}
      />
    </div>
  )
}

export default CoinChart
