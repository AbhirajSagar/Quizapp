import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ user, attempts, title, subtitle = '' }) 
{
  const [darkMode, setMode] = useState(localStorage.getItem('mode') === 'true');
  const [filter, setFilter] = useState('Last 7 days');

  useEffect(() => setMode(localStorage.getItem('mode') === 'true'), [localStorage.getItem('mode')]);

  // Filter attempts by selected date range
  const filteredAttempts = () => 
  {
    const now = new Date();
    const keys = Object.keys(attempts);
    return keys.filter(key => 
    {
      const date = new Date(key);
      switch(filter) 
      {
        case 'Today':
          return date.toDateString() === now.toDateString();
        case 'Yesterday':
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          return date.toDateString() === yesterday.toDateString();
        case 'Last 7 days':
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return date >= sevenDaysAgo && date <= now;
        case 'This month':
          return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
        case 'This year':
          return date.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const tempLabels = filteredAttempts();
  const labels = tempLabels.map(tempLabel =>
  {
    const date = new Date(tempLabel);
    const day = getDayWithSuffix(date.getDate());
    const month = date.toLocaleString('en-IN', { month: 'long' });
    return `${day} ${month}`;
  });

  const scores = tempLabels.map(key => attempts[key]);
  const rootStyles = getComputedStyle(document.documentElement);

  const barDarkColor = rootStyles.getPropertyValue(`--color-dark-tertiary`).trim();
  const barLightColor = rootStyles.getPropertyValue(`--color-accent-one`).trim();
  const tooltipDarkColor = rootStyles.getPropertyValue(`--color-dark-primary`).trim();

  function getDayWithSuffix(day) 
  {
    if (day > 3 && day < 21) return day + 'th';
    switch (day % 10) 
    {
      case 1: return day + 'st';
      case 2: return day + 'nd';
      case 3: return day + 'rd';
      default: return day + 'th';
    }
  }

  const data =
  {
    labels: labels,
    datasets:
      [
        {
          label: 'Best Score',
          data: scores,
          borderColor: darkMode ? barDarkColor : barLightColor,
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
      tooltip: 
      {
        backgroundColor: tooltipDarkColor,
        padding: 12,
        titleFont: 
        {
          size: 14,
          family: "'Parkinsans', sans-serif"
        },
        bodyFont: 
        {
          size: 13,
          family: "'Parkinsans', sans-serif"
        },
        callbacks: 
        {
          title: context => 
          {
            const originalKey = tempLabels[context[0].dataIndex];
            return `Date: ${new Date(originalKey).toLocaleString('en-IN')}`;
          },
          label: context => `Score: ${context.parsed.y}`
        }
      }
    },
    scales:
    {
      y: 
      {
        beginAtZero: true,
        grid: 
        {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: 
        {
          font: 
          {
            size: 12,
            family: "'Parkinsans', sans-serif",
          },
          padding: 8,
          color: darkMode ? 'white' : 'var(--color-dark-primary)'
        }
      },
      x: 
      {
        grid: 
        {
          display: false
        },
        ticks: 
        {
          font: 
          {
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

      <select
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className='mb-4 p-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white'
      >
        <option>Last 7 days</option>
        <option>Today</option>
        <option>Yesterday</option>
        <option>This month</option>
        <option>This year</option>
      </select>

      <div className="relative w-full h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}