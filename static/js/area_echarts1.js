// alert('area_eharts.js')
// $(function(){
//     alert('xss');
// })
$(function(){

        var local_var = '';
        // alert('/get_map_data');

        $.ajax({
            url: '/get_map_data',
            type: 'get',
            dataTpye: 'json',
            success: function (res) {
                // console.log('/get_map_data');
                // console.log(res['country']);
                local_var = res;
                // console.log(res);
                mymap(res);
                indexchart5(res['country_every_data']);
                indexchart2(res['country_every_data'])
            },
            error:function (res) {
                console.log('erro');
                // console.log(res);
            }
        });
        function mymap(data) {
            var MapContainer = document.getElementById('map_1');
            var mapChart = echarts.init(MapContainer);
            // var parent = document.getElementById('map');
            // if (document.getElementById('btn')) {
            //     console.log(document.getElementById('btn'));
            //     parent.removeChild(document.getElementById('btn'));
            // }
            // 34个省、市、自治区的名字拼音映射数组
            var provinces = {
                // 23个省
                台湾: 'taiwan',
                河北: 'hebei',
                山西: 'shanxi',
                辽宁: 'liaoning',
                吉林: 'jilin',
                黑龙江: 'heilongjiang',
                江苏: 'jiangsu',
                浙江: 'zhejiang',
                安徽: 'anhui',
                福建: 'fujian',
                江西: 'jiangxi',
                山东: 'shandong',
                河南: 'henan',
                湖北: 'hubei',
                湖南: 'hunan',
                广东: 'guangdong',
                海南: 'hainan',
                四川: 'sichuan',
                贵州: 'guizhou',
                云南: 'yunnan',
                陕西: 'shanxi2',
                甘肃: 'gansu',
                青海: 'qinghai',
                // 5个自治区
                新疆: 'xinjiang',
                广西: 'guangxi',
                内蒙古: 'neimenggu',
                宁夏: 'ningxia',
                西藏: 'xizang',
                // 4个直辖市
                北京: 'beijing',
                天津: 'tianjin',
                上海: 'shanghai',
                重庆: 'chongqing',
                // 2个特别行政区
                香港: 'xianggang',
                澳门: 'aomen'
              };
            var option = {
                title: {
                    text: '全国疫情地图',
                    left: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize:'16'
                    }
                },
                tooltip: {
                    trigger: 'item',
formatter:'{a}<br/> {b} :{c}<br/>点击查看详情',
                },
                visualMap: [
                    {
                        show: true,                          //是否显示 visualMap-continuous 组件。如果设置为 false，不会显示，但是数据映射的功能还存在
                        type: 'piecewise',                  // 定义为分段型 visualMap
                        // splitNumber: 5,                      //对于连续型数据，自动平均切分成几段。默认为5段
                        color:'#ffffff',
                        pieces: [                           //自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
                            {min: 10001, label: '>10000', color: '#811C24'},                     // 不指定 max，表示 max 为无限大（Infinity）。
                            {min: 1000, max: 10000, label: '1000-10000', color: '#811C24'},
                            {min: 500, max: 999, label: '500-999', color: '#CB2A2F'},
                            {min: 100, max: 499, label: '100-499', color: '#E55A4E'},
                            {min:10,max:99, label: '10-99', color: '#F59E83'},
                            {min:1,max:9, label: '1-9', color: '#FDEBCF'}, // 表示 value 等于 123 的情况。
                            {value: 0 ,label:'0',color: "#FFFFFF"}                        // 不指定 min，表示 min 为无限大（-Infinity）。
                        ],
                        left: '25%',
                        bottom:'0%',
                        textStyle:{
                            color:'#ffffff'
                        }
                        // categories: ['严重污染', '重度污染', '中度污染', '轻度污染', '良', '优'],  //用于表示离散型数据（或可以称为类别型数据、枚举型数据）的全集
                    }
                ],
                series: [{
                        name: '现存确诊人数',
                        type: 'map',
                        aspectScale: 0.75,
                        zoom: 1.2,
                        mapType: 'china',
                        roam: false,
                        label: {
                            show: true,
                            normal: {
                                show: true,//显示省份标签
                                textStyle:{color:"#000000"}//省份标签字体颜色
                            },
                            emphasis: {//对应的鼠标悬浮效果
                                show: false,
                                textStyle:{color:"#800080"}
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: .5,//区域边框宽度
                                borderColor: '#002097',//区域边框颜色
                                areaColor:"#ffffff",//区域颜色
                            },
                            emphasis: {
                                borderWidth: .5,
                                borderColor: '#4b0082',
                                areaColor:"#feff5b",
                            }
                        },
                        data: data['country']
                        // data: [{'name': '湖北', 'value': 300}, {'name': '辽宁', 'value': 120}, {'name': '新疆', 'value': 13},
                        //     {'name': '重启', 'value': 14}]

                    },

                ]


            };
            mapChart.setOption(option);

            window.addEventListener("resize",function(){
            mapChart.resize();
        });
            // 使用刚指定的配置项和数据显示图表。

            mapChart.on('click', function (params) {//点击事件
                // console.log('click');
                // console.log(params.name)
                if (params.name in provinces) {
                    // console.log(data['city']);
                    $.getJSON('https://data.jianshukeji.com/geochina/' + provinces[params.name] + '.json', function (jsondata) { //获得市级地图数据
                        echarts.registerMap(params.name, jsondata);
                        var d = [];
                        for (var i = 0; i < jsondata.features.length; i++) {
                            d.push({
                              name: jsondata.features[i].properties.name
                              })
                          }
                            renderMap(params.name, data)
                    });
                    $.ajax({
            url: '/get_everyday_data',
            type: 'get',
            dataTpye: 'json',

            success: function (res) {
                // console.log('/get_map_data');
                // console.log(res['country']);
                local_var = res;
                // console.log('/get_everyday_data');
                // console.log(res['allcity_everyday_data'][params.name]);
                fchart2(params.name, res);
                fchart5(params.name, res);

            },
            error:function (res) {
                console.log('error');
                // console.log(res);
            }
        });
                }
            })
            }
        function renderMap (map, data) {
            // console.log(data['city'][map]);
            // 初始化绘制省市地图配置
            var cityMapContainer = document.getElementById('map_1');
            // var pos = document.getElementById('map');
            // var btn = document.createElement('button');
            // btn.innerText = "点击标题返回全国地图";
            // // btn.type = 'button';
            // btn.id = 'btn';
            // pos.appendChild(btn);
            var myMapChart = echarts.init(cityMapContainer);
            var option1={
                title : {
                text: map + '疫情地图',
                subtext: '点击标题返回全国地图',
                sublink: window.location.protocol+"//"+window.location.host+'/index',
                subtarget: 'self',
                triggerEvent: true
            },
                tooltip : {
                    trigger: 'item',
                    formatter:'{a}<br/> {b} :{c}<br/>',
                },
                visualMap : {
                    show: true,
                                            color:'#ffffff',

                                       //是否显示 visualMap-continuous 组件。如果设置为 false，不会显示，但是数据映射的功能还存在
                        type: 'piecewise',                  // 定义为分段型 visualMap
                        // splitNumber: 5,                      //对于连续型数据，自动平均切分成几段。默认为5段
                        pieces: [                           //自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
                            {min: 500, label: '>500', color: '#811C24'},                     // 不指定 max，表示 max 为无限大（Infinity）。
                            {min: 200, max: 499, label: '200-499', color: '#811C24'},
                            {min: 100, max: 199, label: '100-199', color: '#CB2A2F'},
                            {min: 50, max: 99, label: '50-99', color: '#E55A4E'},
                            {min:10,max:49, label: '10-49', color: '#F59E83'},
                            {min:1,max:9, label: '1-9', color: '#FDEBCF'}, // 表示 value 等于 123 的情况。
                            {value: 0 ,label:'0',color: "#FFFFFF"}                        // 不指定 min，表示 min 为无限大（-Infinity）。
                        ],
                        left: '25%',
                        textStyle:{
                            color:'#ffffff'
                        },
                },
                series : [
              {
                name: '现存确诊人数',
                type: 'map',
                mapType: map,
                roam: false,
                data: data['city'][map],
    //             data: [{'name': '拉萨', 'value': 300}, {'name': '日喀则', 'value': 120}, {'name': '昌都', 'value': 13},
    //                     {'name': '林芝', 'value': 14}, {'name': '那曲', 'value': 250}, {'name': '阿里', 'value': 100},
    //                 {'name': '山南', 'value': 120}],
                //  data: convertedData[0],
                label: {
                    show: true,
                    emphasis: {//对应的鼠标悬浮效果
                        show: false,
                        textStyle:{color:"#800080"}
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: .5,//区域边框宽度
                        borderColor: '#002097',//区域边框颜色
                        areaColor:"#ffffff",//区域颜色
                    },
                    emphasis: {
                        borderWidth: .5,
                        borderColor: '#4b0082',
                        areaColor:"#feff5b",
                    }
                }
              }
            ],

        };
            // 渲染地图
            myMapChart.setOption(option1);
            myMapChart.on('click', function (params) {
                if (params.componentType == 'subtext') {
                    mymap(local_var)
                }
            });

        }
        function fchart2(city_name, data) {
            var cityevery = document.getElementById('echart2');
            var everydayChart = echarts.init(cityevery);

// 渲染地图
var everydayoption = {
	    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#dddc6b'
            }
        }
    },
		    legend: {
    top:'0%',
        //data:['安卓','IOS'],
                textStyle: {
           color: 'rgba(255,255,255,.5)',
			fontSize:'12',
        }
    },
    grid: {
        left: '10',
		top: '30',
        right: '10',
        bottom: '10',
        containLabel: true
    },

    xAxis: [{
        type: 'category',
        boundaryGap: false,
axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,.6)",
					fontSize:12,
                },
            },
        axisLine: {
			lineStyle: {
				color: 'rgba(255,255,255,.2)'
			}

        },

   //data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
    data: data['allcity_everyday_data'][city_name]['everyday_data']
    }, {

        axisPointer: {show: false},
        axisLine: {  show: false},
        position: 'bottom',
        offset: 20,



    }],

    yAxis: [{
        type: 'value',
        axisTick: {show: false},
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.1)'
            }
        },
       axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,.6)",
					fontSize:12,
                },
            },

        splitLine: {
            lineStyle: {
                 color: 'rgba(255,255,255,.1)'
            }
        }
    }],
    series: [
		{
        name: '确诊',
        type: 'line',
         smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#d5110d',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(1, 132, 213, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(1, 132, 213, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#d5110d',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4,3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]
            data: data['allcity_everyday_data'][city_name]['everyday_add']

    },

        {
        name: '治愈',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#00d887',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#00d887',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
    data: data['allcity_everyday_data'][city_name]['everyday_cure']

    },
        {
        name: '死亡',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#d2d1d8',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#d2d1d8',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
    data: data['allcity_everyday_data'][city_name]['everyday_dead']

    },

		 ]

};
                        everydayChart.setOption(everydayoption);

        }
        function fchart5(city_name, data) {
            var citytotal = document.getElementById('echart5');
            var totalChart = echarts.init(citytotal);

// 渲染地图
var totaloption = {
	    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#dddc6b'
            }
        }
    },
		    legend: {
    top:'0%',
        //data:['安卓','IOS'],
                textStyle: {
           color: 'rgba(255,255,255,.5)',
			fontSize:'12',
        }
    },
    grid: {
        left: '10',
		top: '30',
        right: '10',
        bottom: '10',
        containLabel: true
    },

    xAxis: [{
        type: 'category',
        boundaryGap: false,
axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,.6)",
					fontSize:12,
                },
            },
        axisLine: {
			lineStyle: {
				color: 'rgba(255,255,255,.2)'
			}

        },

   //data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
    data: data['allcity_everyday_data'][city_name]['everyday_data']
    }, {

        axisPointer: {show: false},
        axisLine: {  show: false},
        position: 'bottom',
        offset: 20,



    }],

    yAxis: [{
        type: 'value',
        axisTick: {show: false},
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.1)'
            }
        },
       axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,.6)",
					fontSize:12,
                },
            },

        splitLine: {
            lineStyle: {
                 color: 'rgba(255,255,255,.1)'
            }
        }
    }],
    series: [
		{
        name: '累计确诊',
        type: 'line',
         smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#d5110d',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(1, 132, 213, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(1, 132, 213, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#d5110d',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4,3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]
            data: data['allcity_everyday_data'][city_name]['total_data']

    },
        {
        name: '累计治愈',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#00d887',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#00d887',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
    data: data['allcity_everyday_data'][city_name]['total_cure']

    },
        {
        name: '累计死亡',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#d2d1d8',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#d2d1d8',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
    data: data['allcity_everyday_data'][city_name]['total_dead']

    },

		 ]

};
                        totalChart.setOption(totaloption);

        }
        function indexchart5(data) {
                        var citytotal = document.getElementById('echart5');
            var totalChart = echarts.init(citytotal);

// 渲染地图
var totaloption = {
	    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#dddc6b'
            }
        }
    },
		    legend: {
    top:'0%',
        //data:['安卓','IOS'],
                textStyle: {
           color: 'rgba(255,255,255,.5)',
			fontSize:'12',
        }
    },
    grid: {
        left: '10',
		top: '30',
        right: '10',
        bottom: '10',
        containLabel: true
    },

    xAxis: [{
        type: 'category',
        boundaryGap: false,
axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,.6)",
					fontSize:12,
                },
            },
        axisLine: {
			lineStyle: {
				color: 'rgba(255,255,255,.2)'
			}

        },

   //data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
    data: data['x_name']
    }, {

        axisPointer: {show: false},
        axisLine: {  show: false},
        position: 'bottom',
        offset: 20,



    }],

    yAxis: [{
        type: 'value',
        axisTick: {show: false},
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.1)'
            }
        },
       axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,.6)",
					fontSize:12,
                },
            },

        splitLine: {
            lineStyle: {
                 color: 'rgba(255,255,255,.1)'
            }
        }
    }],
    series: [
		{
        name: '累计确诊',
        type: 'line',
         smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#d5110d',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(1, 132, 213, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(1, 132, 213, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#d5110d',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4,3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]
            data: data['confirm']

    },
        {
        name: '累计治愈',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#00d887',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#00d887',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
    data: data['heal']
    },
        {
        name: '累计死亡',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#d2d1d8',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#d2d1d8',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
    data: data['dead']

    },

		 ]

};
                        totalChart.setOption(totaloption);
        }
        function indexchart2(data) {
                        var citytotal = document.getElementById('echart2');
            var totalChart = echarts.init(citytotal);

// 渲染地图
var totaloption = {
	    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#dddc6b'
            }
        }
    },
		    legend: {
    top:'0%',
        //data:['安卓','IOS'],
                textStyle: {
           color: 'rgba(255,255,255,.5)',
			fontSize:'12',
        }
    },
    grid: {
        left: '10',
		top: '30',
        right: '10',
        bottom: '10',
        containLabel: true
    },

    xAxis: [{
        type: 'category',
        boundaryGap: false,
axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,.6)",
					fontSize:12,
                },
            },
        axisLine: {
			lineStyle: {
				color: 'rgba(255,255,255,.2)'
			}

        },

   //data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
    data: data['x_name']
    }, {

        axisPointer: {show: false},
        axisLine: {  show: false},
        position: 'bottom',
        offset: 20,



    }],

    yAxis: [{
        type: 'value',
        axisTick: {show: false},
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.1)'
            }
        },
       axisLabel:  {
                textStyle: {
 					color: "rgba(255,255,255,.6)",
					fontSize:12,
                },
            },

        splitLine: {
            lineStyle: {
                 color: 'rgba(255,255,255,.1)'
            }
        }
    }],
    series: [
		{
        name: '当日确诊',
        type: 'line',
         smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#d5110d',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(1, 132, 213, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(1, 132, 213, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#d5110d',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4,3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]
            data: data['today_confirm']

    },
        {
        name: '当日治愈',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#00d887',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#00d887',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
    data: data['today_heal']
    },
        {
        name: '当日死亡',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {

            normal: {
				color: '#d2d1d8',
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.4)'
                }, {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
            }
        },
			itemStyle: {
			normal: {
				color: '#d2d1d8',
				borderColor: 'rgba(221, 220, 107, .1)',
				borderWidth: 12
			}
		},
        //data: [5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
    data: data['today_dead']

    },

		 ]

};
                        totalChart.setOption(totaloption);
        }

	}
);
