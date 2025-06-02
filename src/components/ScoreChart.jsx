import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ScoreChart({ attempts }) 
{
    const labels = Object.keys(attempts);
    const scores = Object.values(attempts);

    const data = 
    {
        labels: labels,
        datasets: 
        [
            {
            label: 'Best Score',
            data: scores,
            backgroundColor: 'var(--light-primary)',
            maxBarThickness: 60
            }
        ]
    };


  const options = 
  {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Leaderboard - Best Scores' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return <Bar data={data} options={options} />;
}
