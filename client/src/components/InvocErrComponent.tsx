// import { Bar } from "react-chartjs-2";

// const InvocErrComponent = () => {
//   const data = {
//     labels: ['App A', 'App B', 'App C', 'App D', 'App E'],
//     datasets: [
//       {
//         label: 'Errors',
//         data: [12, 19, 3, 5, 2],
//         backgroundColor: 'rgba(75, 192, 192, 1)',
//       },
//     ],
//   };

//   return (
//     <div>
//       <h2>Invocation Error Rates</h2>
//       <Bar data={data} />
//     </div>
//   )
// };

// export default InvocErrComponent;

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const InvocErrComponent = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
  }, []);

  // Chart data configuration
  const data = {
    labels: ['App A', 'App B', 'App C', 'App D', 'App E'],
    datasets: [
      {
        label: 'Errors',
        data: [12, 19, 3, 5, 2],
        backgroundColor: darkMode ? 'rgba(75, 192, 192, 0.8)' : 'rgba(75, 192, 192, 0.8)', // Bar color for dark and light mode
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)', // Border color for dark and light mode
        borderWidth: 1,
      },
    ],
  };

  // Chart options configuration
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#b1a6a6' : '#d6a1a1', // Legend text color for dark and light mode
        },
      },
      tooltip: {
        callbacks: {
          labelTextColor: () => darkMode ? '#b1a6a6' : '#d6a1a1', // Tooltip text color for dark and light mode
        },
      },
      title: {
        display: true,
        text: 'Invocation Error Rates',
        color: darkMode ? '#b1a6a6' : '#d6a1a1', // Title text color for dark and light mode
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? '#444' : '#ddd', // Grid line color for dark and light mode
        },
        ticks: {
          color: darkMode ? '#b1a6a6' : '#d6a1a1', // Axis text color for dark and light mode
        },
      },
      x: {
        grid: {
          color: darkMode ? '#444' : '#ddd', // Grid line color for dark and light mode
        },
        ticks: {
          color: darkMode ? '#b1a6a6' : '#d6a1a1', // Axis text color for dark and light mode
        },
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default InvocErrComponent;