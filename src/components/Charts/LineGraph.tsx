import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HealthMetric, StatusType } from '../../services/firestore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineGraphProps {
  data: HealthMetric[];
  metricType: string;
  selectedStatus?: StatusType;
}

const LineGraph: React.FC<LineGraphProps> = ({ data, metricType, selectedStatus }) => {
  const getThresholds = () => {
    if (selectedStatus) {
      return {
        ...selectedStatus.thresholds,
        label: selectedStatus.name
      };
    }

    // Fallback defaults
    switch (metricType) {
      case 'blood-pressure':
        return {
          normal: 120,
          elevated: 129,
          high: 130,
          label: 'Blood Pressure',
          ranges: {
            normal: 'Normal',
            elevated: 'Elevated',
            high: 'High'
          }
        };
      case 'sleep-quality':
        return {
          normal: 7,
          elevated: 8,
          high: 9,
          label: 'Sleep Quality',
          ranges: {
            normal: 'Poor',
            elevated: 'Good',
            high: 'Excellent'
          }
        };
      default:
        return {
          normal: 50,
          elevated: 75,
          high: 100,
          label: metricType.split('-').join(' '),
          ranges: {
            normal: 'Low',
            elevated: 'Medium',
            high: 'High'
          }
        };
    }
  };

  const thresholds = getThresholds();

  const sortedData = [...data].sort((a, b) => 
    a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime()
  );

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${thresholds.label} Trend`,
        color: '#333',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: (context) => {
            if (context.tick.value === thresholds.normal) return 'rgba(75, 192, 192, 0.2)';
            if (context.tick.value === thresholds.elevated) return 'rgba(255, 206, 86, 0.2)';
            if (context.tick.value === thresholds.high) return 'rgba(255, 99, 132, 0.2)';
            return 'rgba(0, 0, 0, 0.1)';
          }
        }
      }
    }
  };

  const chartData = {
    labels: sortedData.map(item => 
      item.timestamp.toDate().toLocaleDateString()
    ),
    datasets: [
      {
        label: thresholds.label,
        data: sortedData.map(item => parseFloat(item.value)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
      {
        label: thresholds.ranges.normal,
        data: Array(sortedData.length).fill(thresholds.normal),
        borderColor: 'rgba(75, 192, 192, 0.5)',
        borderDash: [5, 5],
        pointRadius: 0,
      },
      {
        label: thresholds.ranges.elevated,
        data: Array(sortedData.length).fill(thresholds.elevated),
        borderColor: 'rgba(255, 206, 86, 0.5)',
        borderDash: [5, 5],
        pointRadius: 0,
      },
      {
        label: thresholds.ranges.high,
        data: Array(sortedData.length).fill(thresholds.high),
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
        pointRadius: 0,
      }
    ]
  };

  return (
    <div className="chart-wrapper">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default LineGraph;