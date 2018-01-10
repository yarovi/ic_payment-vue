const config = {};

export default [{
  label: config.title || '',
  fill: true,
  lineTension: 0.3,
  backgroundColor: config.backgroundColor || 'rgba(3,169,244 ,.6)',
  borderColor: config.borderColor || 'rgba(3,169,244 ,1)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: 'dodgerblue',
  pointBackgroundColor: 'dodgerblue',
  pointBorderWidth: 1,
  pointHoverRadius: 7,
  pointHoverBackgroundColor: config.pointHoverBackgroundColor || '#fff',
  pointHoverBorderColor: config.pointHoverBorderColor || '#0077ff',
  pointHoverBorderWidth: config.pointHoverBoderWith || 2,
  pointRadius: 1,
  pointHitRadius: 10,
  data: '',
  spanGaps: false,
}];
