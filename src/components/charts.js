import Chart from 'chart.js/auto';

// Shared Chart Options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: { display: false },
    y: { display: false }
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
};

export function createSparkline(ctx, data, color) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data: data,
        borderColor: color,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      }]
    },
    options: commonOptions
  });
}

export function createAreaChart(ctx, labels, data) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(64, 150, 255, 0.5)'); // primary glow
  gradient.addColorStop(1, 'rgba(64, 150, 255, 0.0)');

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Portfolio Value',
        data: data,
        borderColor: 'oklch(0.65 0.2 260)', // primary
        backgroundColor: gradient,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      }]
    },
    options: {
      ...commonOptions,
      scales: {
        x: { 
          display: true, 
          grid: { display: false, color: 'rgba(255,255,255,0.1)' } 
        },
        y: { 
          display: true, 
          grid: { color: 'rgba(255,255,255,0.05)' } 
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(30, 35, 50, 0.9)',
          titleColor: '#fff',
          bodyColor: 'oklch(0.7 0.15 150)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return '$' + context.parsed.y.toLocaleString();
            }
          }
        }
      }
    }
  });
}

export function createDoughnutChart(ctx, dataArr, labelsArr, colorsArr) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labelsArr,
      datasets: [{
        data: dataArr,
        backgroundColor: colorsArr,
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#fff' }
        }
      }
    }
  });
}
