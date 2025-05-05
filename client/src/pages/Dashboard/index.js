import {useState, useEffect, useRef} from 'react';
import {Chart, registerables} from 'chart.js';
import {getAllDataAPI} from '../../apis/data';
import './index.css';

Chart.register(...registerables);

const bgColorList1 = [
    'rgb(255, 173, 173)',
    'rgb(255, 214, 165)',
    'rgb(253, 255, 182)',
    'rgb(202, 255, 191)',
    'rgb(155, 246, 255)',
    'rgb(160, 196, 255)',
    'rgb(189, 178, 255)',
    'rgb(255, 198, 255)'
];

const bgColorList2 = [
    'rgb(128, 155, 206)',
    'rgb(149, 184, 209)',
    'rgb(212, 224, 223)',
    'rgb(214, 234, 223)',
    'rgb(234, 196, 213)',
    'rgb(169, 201, 221)',
    'rgb(202, 240, 246)',
    'rgb(255, 255, 234)',
    'rgb(255, 240, 212)'
]

function generateRepeatColors(colorList, count){
    let newColorList = colorList;
    for(let i = 0; i < count; i++){
        newColorList.push(colorList[i % colorList.length]);
    }
    return newColorList;
}

const Dashboard = ()=>{
    const themeChartRef = useRef(null);
    const subthemeChartRef = useRef(null);
    const themeChartInstance = useRef(null);
    const subthemeChartInstance = useRef(null);
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

        return () => {
            themeChartInstance.current?.destroy();
            subthemeChartInstance.current?.destroy();
        };
    }, [])

    useEffect(() => {
        if (dataList.length === 0 || !themeChartRef.current) return;

        const themeCounts = dataList.reduce((acc, item) => {
            if(acc.seen.indexOf({name: item.name, theme: item.theme}) === -1){
                acc.counts[item.theme] = (acc.counts[item.theme] || 0) + 1;
                acc.seen.push({name:item.name, theme:item.theme});
            }
            return acc;
        }, {seen:[], counts:[]}).counts;

        const subthemeCounts = dataList.reduce((acc, item) => {
            acc[item.subtheme] = (acc[item.subtheme] || 0) + 1;
            return acc;
        }, {})

        const themeLabels = Object.keys(themeCounts);
        const themeData = Object.values(themeCounts);
        const subthemeLabels = Object.keys(subthemeCounts);
        const subthemeData = Object.values(subthemeCounts);

        const backgroundColors1 = bgColorList1.slice(0, themeLabels.length);
        const backgroundColors2 = generateRepeatColors(bgColorList2, subthemeLabels.length);

        themeChartInstance.current?.destroy();
        subthemeChartInstance.current?.destroy();

        themeChartInstance.current = new Chart(themeChartRef.current, {
            type: 'pie',
            data: {
                labels: themeLabels,
                datasets: [{
                    label: 'Theme Distribution',
                    data: themeData,
                    backgroundColor: backgroundColors1,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    title: {
                        display: true,
                        text: "Theme Distribution",
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            } 
        });

        subthemeChartInstance.current = new Chart(subthemeChartRef.current, {
            type:'bar',
            data:{
                labels: subthemeLabels,
                datasets: [{
                    label: "Subtheme Distribution",
                    data: subthemeData,
                    backgroundColor: backgroundColors2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: "Subtheme Distribution",
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            } 
        })

    }, [dataList]);

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            {loading ? <div>loading...</div> : 
            <div className="chart-container">
                <div className="chart">
                    <canvas ref={themeChartRef}></canvas>
                </div>
                <div className="chart">
                    <canvas ref={subthemeChartRef}></canvas>
                </div>
            </div>
            }
        </div>
    )
}

export default Dashboard;