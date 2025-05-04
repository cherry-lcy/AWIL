import {useState, useEffect, useRef} from 'react';
import {Chart, registerables} from 'chart.js';
import {getAllDataAPI} from '../../apis/data';
import './index.css';

Chart.register(...registerables);

const pieConfig = {
    type: 'pie',
    data: {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      }
};

const Dashboard = ()=>{
    const themeChartRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [dataList, setDataList] = useState([]);

    useEffect(()=>{
        async function loadAllData(){
            try{
                setLoading(true);
                const res = await getAllDataAPI();
                setDataList(res.data || []);
            }
            catch(e){
                console.error("Failed to fetch required data: ", e.message);
            }
            finally{
                setLoading(false);
            }
        }

        loadAllData();
    }, [])

    const themeCounts = dataList.reduce((acc, item) => {
        acc[item.theme] = (acc[item.theme] || 0) + 1;
        return acc;
    }, {})

    pieConfig.data.datasets[0].data = themeCounts;;

    const themeChart = new Chart(themeChartRef, pieConfig);

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            {loading ? <div>loading...</div> : 
            <div className="chart-container">
                <div>
                    <canvas ref={themeChartRef} width="400" height="400"></canvas>
                </div>
            </div>
            }
        </div>
    )
}

export default Dashboard;