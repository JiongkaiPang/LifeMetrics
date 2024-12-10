import React from 'react'; 
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'; 
import { Bar } from 'react-chartjs-2'; 
import { HealthMetric, StatusType } from '../../services/firestore'; 
 
ChartJS.register( 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
); 
 
interface BarChartProps { 
  data: HealthMetric[]; 
  metricType: string; 
  selectedStatus?: StatusType; 
} 
 
const BarChart: React.FC<BarChartProps> = ({ data, metricType, selectedStatus }) => { 
  const getThresholds = () => { 
    if (selectedStatus) { 
      return selectedStatus.thresholds; 
    } 
 
    // Fallback defaults 
    switch (metricType) { 
      case 'blood-pressure': 
        return { 
          normal: 120, 
          elevated: 129, 
          high: 130, 
          ranges: { 
            normal: 'Normal (<120)', 
            elevated: 'Elevated (120-129)', 
            high: 'High (>130)' 
          } 
        }; 
      case 'sleep-quality': 
        return { 
          normal: 7, 
          elevated: 8, 
          high: 9, 
          ranges: { 
            normal: 'Poor (<7)', 
            elevated: 'Good (7-8)', 
            high: 'Excellent (>8)' 
          } 
        }; 
      default: 
        return { 
          normal: 50, 
          elevated: 75, 
          high: 100, 
          ranges: { 
            normal: 'Low', 
            elevated: 'Medium', 
            high: 'High' 
          } 
        }; 
    } 
  }; 
 
  const thresholds = getThresholds(); 
 
  const processData = () => { 
    const categorizedData = { 
      normal: 0, 
      elevated: 0, 
      high: 0 
    }; 
 
    data.forEach(metric => { 
      const value = parseFloat(metric.value); 
      if (value < thresholds.normal) { 
        categorizedData.normal++; 
      } else if (value <= thresholds.elevated) { 
        categorizedData.elevated++; 
      } else { 
        categorizedData.high++; 
      } 
    }); 
 
    return categorizedData; 
  }; 
 
  const chartData = processData(); 
 
  const options = { 
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: { 
      legend: { 
        display: false 
      }, 
      title: { 
        display: true, 
        text: `${selectedStatus?.name || metricType.split('-').join(' ').toUpperCase()} Distribution`, 
        color: '#333', 
        font: { 
          size: 16 
        } 
      } 
    }, 
    scales: { 
      y: { 
        beginAtZero: true, 
        title: { 
          display: true, 
          text: 'Number of Readings' 
        } 
      } 
    } 
  }; 
 
  const chartDataConfig = { 
    labels: [ 
      thresholds.ranges.normal, 
      thresholds.ranges.elevated, 
      thresholds.ranges.high 
    ], 
    datasets: [ 
      { 
        data: [chartData.normal, chartData.elevated, chartData.high], 
        backgroundColor: [ 
          'rgba(75, 192, 192, 0.6)',  // Green for normal 
          'rgba(255, 206, 86, 0.6)',  // Yellow for elevated 
          'rgba(255, 99, 132, 0.6)'   // Red for high 
        ], 
        borderColor: [ 
          'rgba(75, 192, 192, 1)', 
          'rgba(255, 206, 86, 1)', 
          'rgba(255, 99, 132, 1)' 
        ], 
        borderWidth: 1, 
      } 
    ] 
  }; 
 
  return ( 
    <div className="chart-wrapper"> 
      <Bar options={options} data={chartDataConfig} /> 
    </div> 
  ); 
}; 
 
export default BarChart; 