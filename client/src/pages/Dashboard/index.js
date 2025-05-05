import {useState, useEffect, useRef} from 'react';
import * as echarts from 'echarts';
import {getAllDataAPI} from '../../apis/data';
import './index.css';

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

function generateRepeatColors(colorList, count){
    let newColorList = [];
    for(let i = 0; i < count; i++){
        newColorList.push(colorList[i % colorList.length]);
    }
    return newColorList;
}

const Dashboard = ()=>{
    const themeChartRef = useRef(null);
    const ACEchartRef = useRef(null);
    const PDchartRef = useRef(null);
    const EDUchartRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const themeChartInstance = useRef(null);
    const ACEchartInstance = useRef(null);
    const PDchartInstance = useRef(null);
    const EDUchartInstance = useRef(null);

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
            if (themeChartInstance.current) {
                themeChartInstance.current.dispose();
            }
            if (ACEchartInstance.current) {
                ACEchartInstance.current.dispose();
            }
            if (PDchartInstance.current) {
                PDchartInstance.current.dispose();
            }
            if(EDUchartInstance.current){
                EDUchartInstance.current.dispose();
            }
        };        
    }, []);

    useEffect(() => {
        if (dataList.length === 0 || !themeChartRef.current 
            || !ACEchartRef.current || !PDchartRef.current 
            || !EDUchartRef.current) return;

        themeChartInstance.current = echarts.init(themeChartRef.current);
        ACEchartInstance.current = echarts.init(ACEchartRef.current);
        PDchartInstance.current = echarts.init(PDchartRef.current);
        EDUchartInstance.current = echarts.init(EDUchartRef.current);

        const themeCounts = dataList.reduce((acc, item) => {
            const key = `${item.name}-${item.theme}`;
            if(!acc.seen.has(key)){
                acc.counts[item.theme] = (acc.counts[item.theme] || 0) + 1;
                acc.seen.add(key);
            }
            return acc;
        }, {seen: new Set(), counts: {}});

        const themeData = Object.entries(themeCounts.counts).map(([name, value]) => ({
            name,
            value
        }));

        const ACECounts = dataList.reduce((acc, item) => {
            if(item.theme === "ACE" && item.subtheme === "TE"){
                acc[item.category] = (acc[item.category] || 0) + 1;            }
            return acc;
        }, {});

        const ACEData = Object.entries(ACECounts).map(([name, value]) => ({
            name,
            value
        }));

        const PDCounts = dataList.reduce((acc, item) => {
            if(item.theme === "PD"){
                if(item.subtheme === "PD" && item.category === "PD"){
                    return acc;
                }

                if(!acc[item.subtheme]){
                    acc[item.subtheme] = {
                        value: 0,
                        children:[]
                    }
                }

                acc[item.subtheme].value++;

                const categoryCounts = acc[item.subtheme].children.find(child => child.name === item.category);
                if(categoryCounts){
                    categoryCounts.value++;
                }
                else{
                    acc[item.subtheme].children.push({
                        name: item.category,
                        value: 1
                    })
                }
            }

            return acc;

        }, {});

        const sunburstData = {
            name: "PD",
            children: Object.entries(PDCounts).map(([subtheme, data]) => ({
                name: subtheme,
                value: data.value,
                children: data.children
            }))
        };

        const EDUCounts = dataList.reduce((acc, item) => {
            if(item.theme === "EDU"){
                if(item.subtheme === "EDU" && item.category === "EDU"){
                    return acc;
                }

                if(!acc[item.subtheme]){
                    acc[item.subtheme] = {
                        value: 0,
                        children: []
                    }
                }

                acc[item.subtheme].value++;

                const categoryCounts = acc[item.subtheme].children.find(child => child.name === item.category);
                if(categoryCounts){
                    categoryCounts.value++;
                }
                else{
                    acc[item.subtheme].children.push({
                        name: item.category,
                        value: 0
                    })
                }
            }

            return acc;
        
        }, {});

        const sunburstData2 = {
            name:"EDU",
            children: Object.entries(EDUCounts).map(([subtheme, data]) => {
                return {
                    name: subtheme,
                    value: data.value,
                    children: data.children
                }
            })
        }

        const backgroundColors1 = bgColorList1.slice(0, themeData.length);
        const backgroundColors2 = generateRepeatColors(bgColorList1, ACEData.length);        

        themeChartInstance.current.setOption({
            series: [{
                type: 'pie',
                name: "Theme Distribution",
                radius: ['40%', '70%'],
                color: backgroundColors1,
                data: themeData,
                roseType: 'area',
                label: {
                    show: true,
                    formatter: '{b}'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                }
            }],
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            title: {
                text: "Theme Distribution",
                left: "center",
                textStyle: {
                    fontSize: 16
                }
            },
        });

        ACEchartInstance.current.setOption({
            title: {
                text: "Category Distribution under \n Theme \"ACE\" and Subtheme \"TE\"",
                left: "center",
                textStyle: {
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: (params) => {
                    const data = params[0];
                    const total = ACEData.reduce((sum, item) => sum + item.value, 0);
                    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(2) : 0;
                    return `${data.name}: ${data.value} (${percentage}%)`;
                }
            },
            xAxis: {
                type: "category",
                data: ACEData.map(item => item.name),
                axisLabel: {
                    rotate: 30,
                    interval: 0
                }
            },
            yAxis: {
                type: "value",
                name: "Count"
            },
            color: backgroundColors2,
            series: [{
                name: "Category Distribution",
                type: 'bar',
                data: ACEData.map((item, index) => {
                    return {
                        value: item.value,
                        itemStyle: {
                            color: backgroundColors2[index % backgroundColors2.length]
                        }
                    }
                }),
                label: {
                    show: true,
                    position: 'top'
                },
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }]
        });

        PDchartInstance.current.setOption({
            title:{
                text:"Subtheme and Category Distribution\n under Theme \"PD\"",
                left: "center",
                textStyle:{
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}'
            },
            series:[{
                type: 'sunburst',
                name: "Subtheme and Category Distribution under Theme \"PD\"",
                data: sunburstData.children,
                radius: [0, '90%'],
                label: {
                    show: true,
                    formatter: function(params) {
                        return params.name;
                    }
                },
                levels: [
                        {},
                        {
                            r0: '15%',
                            r: '45%',
                            label: {
                                rotate: 'tangential',
                                fontSize: 14
                            },
                            itemStyle: {
                                borderWidth: 2,
                                borderColor: '#fff'
                            }
                        },
                        {
                            r0: '45%',
                            r: '80%',
                            label: {
                                align: 'right',
                                fontSize: 12
                            },
                            itemStyle: {
                                borderWidth: 1,
                                borderColor: '#fff'
                            }
                        }
                    ],
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            }]
        });

        EDUchartInstance.current.setOption({
            title:{
                text: "Subtheme and Category Distribution under Theme \"EDU\"",
                left:"center",
                textStyle:{
                    fontSize: 16
                }
            },
            tooltip:{
                trigger:"item",
                formatter: '{b}: {c}'
            },
            series:[{
                type:'sunburst',
                name:"Subtheme and Category Distribution\n under Theme \"EDU\"",
                data: sunburstData2.children,
                radius: [0, "90%"],
                label:{
                    show:true,
                    formatter: function(params){
                        return params.name;
                    }
                },
                levels: [
                    {},
                    {
                        r0: '15%',
                        r: '45%',
                        label: {
                            rotate: 'tangential',
                            fontSize: 14
                        },
                        itemStyle: {
                            borderWidth: 2,
                            borderColor: '#fff'
                        }
                    },
                    {
                        r0: '45%',
                        r: '80%',
                        label: {
                            align: 'right',
                            fontSize: 12
                        },
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#fff'
                        }
                    }
                ],
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            }]
        });


        const handleResize = () => {
            themeChartInstance.current?.resize();
            ACEchartInstance.current?.resize();
            PDchartInstance.current?.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [dataList]);

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            {loading ? <div>Loading...</div> : 
            <div className="chart-container">
                <div 
                    className="chart" 
                    ref={themeChartRef}
                />
                <div 
                    className="chart" 
                    ref={ACEchartRef}
                />
                <div 
                    className="chart"
                    ref={PDchartRef}
                />
                <div
                    className="chart"
                    ref={EDUchartRef}
                />
            </div>
            }
        </div>
    )
}

export default Dashboard;