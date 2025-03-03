import ReactApexChart from 'react-apexcharts'

// Import Images
import comingSoon from '../../../assets/images/file.png'
import getChartColorsArray from '../../../Components/Common/ChartsDynamicColor'

const ImageRadialbar = ({
  value,
  dataColors
}: {
  value: number
  dataColors: any
}) => {
  var chartRadialbarBasicColors = getChartColorsArray(dataColors)
  const series = [value]
  var options = {
    chart: {
      height: 315,
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: '65%',
          image: comingSoon,
          imageWidth: 100,
          imageHeight: 100,
          imageClipped: false
        },
        dataLabels: {
          name: {
            show: false,
            color: '#fff'
          },
          value: {
            show: true,
            color: '#333',
            offsetY: 65,
            fontSize: '22px'
          }
        }
      }
    },
    // fill: {
    //     type: 'image',
    //     image: {
    //         src: [Img4],
    //     }
    // },
    stroke: {
      lineCap: 'round'
    },
    colors: chartRadialbarBasicColors
  }
  return (
    <ReactApexChart
      dir='ltr'
      className='apex-charts'
      series={series}
      options={options}
      type='radialBar'
      height={320}
    />
  )
}

export default ImageRadialbar
