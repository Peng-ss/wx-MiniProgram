import * as echarts from '../../../ec-canvas/echarts';
var utils = require('../../../utils/util.js');
var APIService = require('../../../utils/APIService.js');
var chartday = null;
var chartmonth = null;
var chartyear = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowPower: {},
    startTime: utils.NowTime().substring(0, 10) + " 00:00:00",
    endTime: utils.NowTime().substring(0, 10) + " 23:59:59",
    datType: "day",
    dayData: [],
    monthData: [],
    yearData: [],
    ecday: {
      onInit: function(canvas, width, height) {
        chartday = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chartday);
        return chartday;
      }
    },
    ecmonth: {
      onInit: function(canvas, width, height) {
        chartmonth = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chartmonth);
        return chartmonth;
      }
    },
    ecyear: {
      onInit: function(canvas, width, height) {
        chartyear = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chartyear);
        return chartyear;
      }
    },
    flagday: "block",
    flagmonth: "block",
    flagyear: "block",
  },
  setPageData: function(e, startTime, endTime, datType) {
    var page = this;
    page.setData({
      nowPower: e,
      dayData: [],
      monthData: [],
      yearData: []
    });
    return new Promise(function(resolve, reject) {
      APIService.getElecQueryStat(resolve, e, page, startTime, endTime, datType);
    });
  },
  setViewData: function() {
    var page = this;
    if (page.data.datType == "day") {
      setTimeout(function() {
        chartday.setOption({
          legend: {
            data: [page.data.nowPower.power_id + ":" + page.data.nowPower.power_name, page.data.nowPower.power_id + ":" + page.data.nowPower.power_name+" "],
            bottom: "0"
          },
          color: ["#FF9803", "#67C13D"],
          xAxis: [{
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: ['0-1时', '1-2时', '2-3时', '3-4时', '4-5时',
              '5-6时', '6-7时', '7-8时', '8-9时', '9-10时', '10-11时', '11-12时',
              '12-13时', '13-14时', '14-15时', '15-16时', '16-17时',
              '17-18时', '18-19时', '19-20时', '20-21时', '21-22时', '22-23时', '23-24时'
            ],
            axisLabel: {
              fontSize: 8
            }
          }],
          yAxis: {
            name: '电量(KW)',
            axisLabel: {
              fontSize: 8
            }
          },
          series: [{
            name: page.data.nowPower.power_id + ":" + page.data.nowPower.power_name,
            type: 'bar',
            data: page.data.dayData[page.data.nowPower.power_id + ""]
          }, {
              name: page.data.nowPower.power_id + ":" + page.data.nowPower.power_name+" ",
            type: "line",
            data: page.data.dayData[page.data.nowPower.power_id + ""],
            label: {
              show: true,
              fontSize: 7,
              color: "#000",
              formatter: function(data) {
                return parseFloat(data.value).toFixed(0);
              }
            }
          }]
        });
      }, 1000);
    }
    if (page.data.datType == "month") {
      setTimeout(function() {
        chartmonth.setOption({
          color: ["#E5A13E", "#67C13D", "#F56C6C", "#429DFF"],
          legend: {
            data: ['峰期(kWh)', '平期(kWh)', '谷期(kWh)', '总用电(kWh)'],
            bottom: "0"
          },
          xAxis: [{
            type: 'category',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
          }],
          yAxis: {
            name: '电量(KW)',
            axisLabel: {
              fontSize: 8
            }
          },
          series: [{
              name: '峰期(kWh)',
              type: 'bar',
              stack: '用电量',
              data: page.data.monthData.peak[page.data.nowPower.power_id + ""],
              label: {
                show: true,
                fontSize: 5,
                color: "#000",
                formatter: function(data) {
                  var str = page.data.nowPower.power_id + "";
                  var sumEpi = page.data.monthData.sumEpi[str][data.dataIndex];
                  var value = data.value;
                  if (value != 0 && sumEpi != 0) {
                    var str = 100 * value / sumEpi + "";
                    str = str.substring(0, 4) + "%"
                    return str
                  }
                }
              }
            },
            {
              name: '平期(kWh)',
              type: 'bar',
              stack: '用电量',
              data: page.data.monthData.flat[page.data.nowPower.power_id + ""],
              label: {
                show: true,
                fontSize: 5,
                color: "#000",
                formatter: function(data) {
                  var str = page.data.nowPower.power_id + "";
                  var sumEpi = page.data.monthData.sumEpi[page.data.nowPower.power_id + ""][data.dataIndex];
                  var value = data.value;
                  if (value != 0 && sumEpi != 0) {
                    var str = 100 * value / sumEpi + "";
                    str = str.substring(0, 4) + "%"
                    return str
                  }
                }
              }
            },
            {
              name: '谷期(kWh)',
              type: 'bar',
              stack: '用电量',
              data: page.data.monthData.valley[page.data.nowPower.power_id + ""],
              label: {
                show: true,
                fontSize: 5,
                color: "#000",
                formatter: function(data) {
                  var sumEpi = page.data.monthData.sumEpi[page.data.nowPower.power_id + ""][data.dataIndex];
                  var value = data.value;
                  if (value != 0 && sumEpi != 0) {
                    var str = 100 * value / sumEpi + "";
                    str = str.substring(0, 4) + "%"
                    return str
                  }
                }
              }
            },
            {
              name: '总用电(kWh)',
              type: 'line',
              data: page.data.monthData.sumEpi[page.data.nowPower.power_id + ""],
              label: {
                show: true,
                fontSize: 6
              }
            }
          ]
        });
      }, 1000);
    }
    if (page.data.datType == "year") {
      setTimeout(function() {
        chartyear.setOption({
          grid: [{
            left: "12%"
          }],
          color: ["#E5A13E", "#67C13D", "#F56C6C", "#429DFF"],
          legend: {
            data: ['峰期(kWh)', '平期(kWh)', '谷期(kWh)', '总用电(kWh)'],
            bottom: "0"
          },
          xAxis: [{
            type: 'category',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          }],
          yAxis: {
            name: '电量(KW)',
            axisLabel: {
              fontSize: 8
            }
          },
          series: [{
              name: '峰期(kWh)',
              type: 'bar',
              stack: '用电量',
              data: page.data.yearData.peak[page.data.nowPower.power_id + ""],
              label: {
                show: true,
                fontSize: 5,
                color: "#000",
                formatter: function(data) {
                  var sumEpi = page.data.yearData.sumEpi[page.data.nowPower.power_id + ""][data.dataIndex];
                  var value = data.value;
                  if (value != 0 && sumEpi != 0) {
                    var str = 100 * value / sumEpi + "";
                    str = str.substring(0, 4) + "%"
                    return str
                  }
                }
              }
            },
            {
              name: '平期(kWh)',
              type: 'bar',
              stack: '用电量',
              data: page.data.yearData.flat[page.data.nowPower.power_id + ""],
              label: {
                show: true,
                fontSize: 5,
                color: "#000",
                formatter: function(data) {
                  var sumEpi = page.data.yearData.sumEpi[page.data.nowPower.power_id + ""][data.dataIndex];
                  var value = data.value;
                  if (value != 0 && sumEpi != 0) {
                    var str = 100 * value / sumEpi + "";
                    str = str.substring(0, 4) + "%"
                    return str
                  }
                }
              }
            },
            {
              name: '谷期(kWh)',
              type: 'bar',
              stack: '用电量',
              data: page.data.yearData.valley[page.data.nowPower.power_id + ""],
              label: {
                show: true,
                fontSize: 5,
                color: "#000",
                formatter: function(data) {
                  var sumEpi = page.data.yearData.sumEpi[page.data.nowPower.power_id + ""][data.dataIndex];
                  var value = data.value;
                  if (value != 0 && sumEpi != 0) {
                    var str = 100 * value / sumEpi + "";
                    str = str.substring(0, 4) + "%"
                    return str
                  }
                }
              }
            },
            {
              name: '总用电(kWh)',
              type: 'line',
              data: page.data.yearData.sumEpi[page.data.nowPower.power_id + ""],
              label: {
                show: true,
                fontSize: 6
              }
            }
          ]
        });
      }, 1000);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "电量统计与查询"
    });
    var page = this;
    this.setPageData(getApp().globalData.powerList[0], page.data.startTime, page.data.endTime, page.data.datType).then(() => this.setViewData());
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
      flagday: "none",
      flagmonth: "none",
      flagyear: "none"
    })
  },
  //监听：切换监测点
  _confirmEvent(e) {
    //console.log(e);
    this.setPageData(e.detail, this.data.startTime, this.data.endTime, this.data.datType).then(() => this.setViewData());
    this.viewShowHidden(this.data.datType);
  },
  _cancelEvent() {
    this.viewShowHidden(this.data.datType);
  },
  _getdate(e) {
    var page = this;
    switch ((e.detail + "").length) {
      case 10:
        page.setData({
          datType: "day",
          startTime: e.detail + " 00:00:00",
          endTime: e.detail + " 23:59:59"
        })
        break;
      case 7:
        page.setData({
          datType: "month",
          startTime: e.detail + "-01 00:00:00",
          endTime: utils.assignYearMonthLastDay(e.detail.substring(0, 4), e.detail.substring(5, 7))
        })
        break;
      case 4:
        page.setData({
          datType: "year",
          startTime: e.detail + "-01-01 00:00:00",
          endTime: e.detail + "-12-31 23:59:59"
        })
        break;
    }
    page.setPageData(page.data.nowPower, page.data.startTime, page.data.endTime, page.data.datType).then(() => page.setViewData());
    this.viewShowHidden(this.data.datType);
  },
  viewShowHidden(datType) {
    if (datType == "day") {
      this.setData({
        flagday: "block",
        flagmonth: "none",
        flagyear: "none"
      })
    }
    if (datType == "month") {
      this.setData({
        flagday: "none",
        flagmonth: "block",
        flagyear: "none"
      })
    }
    if (datType == "year") {
      this.setData({
        flagday: "none",
        flagmonth: "none",
        flagyear: "block"
      })
    }
  }

})