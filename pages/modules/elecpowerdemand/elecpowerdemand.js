// pages/elecpowerdemand/elecpowerdemand.js
import * as echarts from '../../../ec-canvas/echarts';
var utils = require('../../../utils/util.js');
var APIService = require('../../../utils/APIService.js');
var chart1 = null;
var chart2 = null;
var chart3 = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowPower: {},
    FPdemand: [],
    P0: [],
    PFT: [],
    epi: [],
    ec1: {
      onInit: function(canvas, width, height) {
        chart1 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart1);
        return chart1;
      }
    },
    ec2: {
      onInit: function(canvas, width, height) {
        chart2 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart2);
        return chart2;
      }
    },
    ec3: {
      onInit: function(canvas, width, height) {
        chart3 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart3);
        return chart3;
      }
    },
  },
  setPageData: function(e) {
    var page = this;
    page.setData({
      nowPower: e
    });
    return new Promise(function(resolve, reject) {
      APIService.getElecPowerDemandJsonBean(resolve, page.data.nowPower, page);
      //console.log(page.data)
    });

  },
  setViewData: function() {
    var page = this;
    var strTime = utils.NowTime().substring(0, 10);
    var maxX = strTime + " 23:59:59";
    setTimeout(function() {
      //设置图1
      chart1.setOption({
        title: {
          text: ''
        },
        color: ["#FF9803", "#67C13D"],
        legend: {
          data: ['有功功率', '需量曲线'],
          top: 'bottom'
        },
        xAxis: {
          type: 'time',
          splitNumber: 8,
          max: utils.timeToTimestamp(maxX) + 1000,
          axisLabel: {
            fontSize: 8,
            formatter: function(value) {
              return utils.timestampToTime(value).substring(11)
            }
          },
          splitLine: {
            show: false
          },
        },
        yAxis: {
          name: '功率曲线(KW)',
          axisLabel: {
            fontSize: 8
          },
          min: function(value) {
            return parseInt(value.min);
          },
          nameTextStyle: {
            color: '#000',
            fontWeight: 'bolder'
          },
          type: 'value',
          splitLine: {
            show: false
          }
        },
        series: [{
            name: '有功功率',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: page.data.P0,
            markArea: {
              data: [
                [{
                  xAxis: 'min',
                  itemStyle: {
                    color: '#F2CBA2'
                  }
                }, {
                  xAxis: strTime + ' 08:00'
                }],
                [{
                  xAxis: strTime + ' 08:00',
                  itemStyle: {
                    color: '#CEFAC4'
                  }
                }, {
                  xAxis: strTime + ' 14:00'
                }],
                [{
                  xAxis: strTime + ' 14:00',
                  itemStyle: {
                    color: '#B7DBF7'
                  }
                }, {
                  xAxis: strTime + ' 17:00'
                }],
                [{
                  xAxis: strTime + ' 17:00',
                  itemStyle: {
                    color: '#CEFAC4'
                  }
                }, {
                  xAxis: strTime + ' 19:00'
                }],
                [{
                  xAxis: strTime + ' 19:00',
                  itemStyle: {
                    color: '#B7DBF7'
                  }
                }, {
                  xAxis: strTime + ' 22:00'
                }],
                [{
                  xAxis: strTime + ' 22:00',
                  itemStyle: {
                    color: '#CEFAC4'
                  }
                }, {
                  xAxis: strTime + ' 24:00'
                }]
              ]
            }
          },
          {
            name: '需量曲线',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: page.data.FPdemand,
            markArea: {
              data: [
                [{
                  xAxis: 'min',
                  itemStyle: {
                    color: '#F2CBA2'
                  },
                }, {
                  xAxis: strTime + ' 08:00'
                }],
                [{
                  xAxis: strTime + ' 08:00',
                  itemStyle: {
                    color: '#CEFAC4'
                  },
                }, {
                  xAxis: strTime + ' 14:00'
                }],
                [{
                  xAxis: strTime + ' 14:00',
                  itemStyle: {
                    color: '#B7DBF7'
                  }
                }, {
                  xAxis: strTime + ' 17:00'
                }],
                [{
                  xAxis: strTime + ' 17:00',
                  itemStyle: {
                    color: '#CEFAC4'
                  }
                }, {
                  xAxis: strTime + ' 19:00'
                }],
                [{
                  xAxis: strTime + ' 19:00',
                  itemStyle: {
                    color: '#B7DBF7'
                  }
                }, {
                  xAxis: strTime + ' 22:00'
                }],
                [{
                  xAxis: strTime + ' 22:00',
                  itemStyle: {
                    color: '#CEFAC4'
                  }
                }, {
                  xAxis: strTime + ' 24:00'
                }]
              ]
            }
          }
        ]
      });
      //设置图2
      chart2.setOption({
        title: {
          text: ''
        },
        color: ["#FF9803"],
        legend: {
          data: ['功率因数'],
          top: 'bottom'
        },
        xAxis: {
          type: 'time',
          show: true,
          splitNumber: 8,
          position: 'bottom',
          max: utils.timeToTimestamp(maxX) + 1000,
          axisLabel: {
            fontSize: 8,
            formatter: function(value) {
              return utils.timestampToTime(value).substring(11)
            }
          },
          splitLine: {
            show: false
          },
        },
        yAxis: {
          name: '总功率因数',
          inverse: true,
          nameLocation: "start",
          axisLabel: {
            fontSize: 8,
            formatter: function(value) {
              return parseFloat(value).toFixed(3);
            }
          },
          max: function(value) {
            return value.max + 0.010;
          },
          min: function(value) {
            return value.min - 0.045;
          },
          nameTextStyle: {
            color: '#000',
            fontWeight: 'bolder'
          },
          type: 'value',
          splitLine: {
            show: false
          }
        },
        series: [{
          name: '功率因数',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: page.data.PFT,
          markArea: {
            data: [
              [{
                xAxis: 'min',
                itemStyle: {
                  color: '#F2CBA2'
                },
              }, {
                xAxis: strTime + ' 08:00'
              }],
              [{
                xAxis: strTime + ' 08:00',
                itemStyle: {
                  color: '#CEFAC4'
                },
              }, {
                xAxis: strTime + ' 14:00'
              }],
              [{
                xAxis: strTime + ' 14:00',
                itemStyle: {
                  color: '#B7DBF7'
                }
              }, {
                xAxis: strTime + ' 17:00'
              }],
              [{
                xAxis: strTime + ' 17:00',
                itemStyle: {
                  color: '#CEFAC4'
                }
              }, {
                xAxis: strTime + ' 19:00'
              }],
              [{
                xAxis: strTime + ' 19:00',
                itemStyle: {
                  color: '#B7DBF7'
                }
              }, {
                xAxis: strTime + ' 22:00'
              }],
              [{
                xAxis: strTime + ' 22:00',
                itemStyle: {
                  color: '#CEFAC4'
                }
              }, {
                xAxis: strTime + ' 24:00'
              }]
            ]
          },
          markLine: {
            symbol: "none",
            label: {
              show: false
            },
            data: [{
                yAxis: 0.9,
                lineStyle: {
                  color: 'red'
                }
              },
              {
                yAxis: 0.95,
                lineStyle: {
                  color: '#007F02'
                }
              }
            ]
          }
        }]
      });
      //设置图3
      chart3.setOption({
        color: ['#FF9803'],
        legend: {
          data: ['正向有功电量'],
          top: 'bottom'
        },
        xAxis: [{
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          min:"0-1时",
          data: ['0-1时', '1-2时', '2-3时', '3-4时', '4-5时',
            '5-6时', '6-7时', '7-8时', '8-9时', '9-10时', '10-11时', '11-12时',
            '12-13时', '13-14时', '14-15时', '15-16时', '16-17时',
            '17-18时', '18-19时', '19-20时', '20-21时', '21-22时', '22-23时', '23-24时'
          ],
          axisLabel: {
            inside: false,
            fontSize: 8
          },
          axisTick: {
            show: true
          },
          axisLine: {
            show: true
          }
        }],
        yAxis: {
          name: '电量(KW)',
          axisLabel: {
            fontSize: 8
          },
          max: function(value) {
            //console.log(value.max)
            if (value.max < 100) {
              return 100;
            } else {
              if (value.max < 1000) {
                return (parseInt((value.max) / 100) + 1) * 100;
              } else {
                return (parseInt((value.max) / 1000) + 2) * 1000;
              }
            }

          },
          nameTextStyle: {
            color: '#000',
            fontWeight: 'bolder'
          },
          type: 'value',
          splitLine: {
            show: false
          }
        },
        series: [{
          type: 'bar',
          data: page.data.epi,
          label: {
            show: true,
            fontSize: 5,
            color: "#000",
            formatter: function (data) {
              return parseFloat(data.value).toFixed(0);
            }
          },
          markArea: {
            data: [
              [{
                xAxis: 'min',
                itemStyle: {
                  color: '#F2CBA2'
                },
              }, {
                xAxis: '7-8时'
              }],
              [{
                xAxis: '7-8时',
                itemStyle: {
                  color: '#CEFAC4'
                },
              }, {
                xAxis: '13-14时'
              }],
              [{
                xAxis: '13-14时',
                itemStyle: {
                  color: '#B7DBF7'
                }
              }, {
                xAxis: '16-17时'
              }],
              [{
                xAxis: '16-17时',
                itemStyle: {
                  color: '#CEFAC4'
                }
              }, {
                xAxis: '18-19时'
              }],
              [{
                xAxis: '18-19时',
                itemStyle: {
                  color: '#B7DBF7'
                }
              }, {
                xAxis: '21-22时'
              }],
              [{
                xAxis: '21-22时',
                itemStyle: {
                  color: '#CEFAC4'
                }
              }, {
                xAxis: '23-24时'
              }]
            ]
          },
        }]
      });
    }, 1000);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: "电量、功率与需量实时监测"
    });
    this.setPageData(getApp().globalData.powerList[0]).then(
      () => this.setViewData()
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent("#dialog");
    this.dialog.setPowerName(getApp().globalData.powerList);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setPageData(this.data.nowPower).then(
      () => this.setViewData()
    );
    setTimeout(function() {
      // complete
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //监听：按钮
  _showDialog() {
    this.setData({
      flag: "none"
    })
  },
  //监听：切换监测点
  _confirmEvent(e) {
    //console.log(e);
    this.setPageData(e.detail, this.data.startTime, this.data.endTime).then(() => this.setViewData());
    this.setData({
      flag: "block"
    })
  },
  _cancelEvent() {
    this.setData({
      flag: "block"
    })
  }
})