import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title)

const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Collections (kg)',
      data: [120, 150, 170, 160, 190, 210, 230],
      borderColor: 'rgba(79,70,229,1)',
      backgroundColor: 'rgba(79,70,229,0.08)',
      tension: 0.3,
      fill: true,
    },
  ],
}

export default function ChartCard() {
  return (
    <div className="bg-[color:var(--card)] p-4 rounded-md shadow">
      <h3 className="font-semibold mb-2">Weekly Collections</h3>
      <Line data={data} />
    </div>
  )
}
