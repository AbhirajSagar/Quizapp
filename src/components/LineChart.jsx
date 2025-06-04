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
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ScoreChart({ user,attempts, title, subtitle = '' }) 
{
  const [darkMode, setMode] = useState(localStorage.getItem('mode') === 'true')
  const labels = Object.keys(attempts);
  const scores = Object.values(attempts);
  const rootStyles = getComputedStyle(document.documentElement);

  const barDarkColor = rootStyles.getPropertyValue(`--color-dark-tertiary`).trim();
  const barLightColor = rootStyles.getPropertyValue(`--color-accent-one`).trim();
  const tooltipDarkColor = rootStyles.getPropertyValue(`--color-dark-primary`).trim();

  useEffect(() => 
  {
    setMode(localStorage.getItem('mode') === 'true')
  }, [localStorage.getItem('mode')]);

  const data =
  {
    labels: labels,
    datasets:
      [
        {
          label: 'Best Score',
          data: scores,
          backgroundColor: scores.map((_, i) => 
          {
            const isUser = labels[i] === user?.user_metadata?.name;
            return isUser
              ? (darkMode ? '#FFD700' : '#FFB800') // Highlight color
              : (darkMode ? barDarkColor : barLightColor)
          })
,
          borderRadius: 10,
          maxBarThickness: 60
        }
      ]
  };

  const options =
  {
    responsive: true,
    maintainAspectRatio: false,
    plugins:
    {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipDarkColor,
        padding: 12,
        titleFont: {
          size: 14,
          family: "'Parkinsans', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Parkinsans', sans-serif"
        }
      }
    },
    scales:
    {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Parkinsans', sans-serif",
          },
          padding: 8,
          color: darkMode ? 'white' : 'var(--color-dark-primary)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Parkinsans', sans-serif"
          },
          color: darkMode ? 'white' : 'var(--color-dark-primary)',
          padding: 8
        }
      }
    }
  };

  return (
    <div className='h-fit flex justify-center items-center flex-col'>
      <h2 className='text-left font-bold dark:text-light-secondary text-accent-one text-md'>{title}</h2>
      {subtitle.length > 0 && <h2 className='text-center dark:text-light-secondary text-accent-one text-xs px-4 mb-4'>{subtitle}</h2>}
      <div className="relative w-full h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
