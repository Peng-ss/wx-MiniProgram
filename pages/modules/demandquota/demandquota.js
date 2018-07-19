// pages/modules/demandquota/demandquota.js
import * as echarts from '../../../ec-canvas/echarts';
var utils = require('../../../utils/util.js');
var APIService = require('../../../utils/APIService.js');
var lineChart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowPower: {},
    startTime: utils.MonthFirstDay(),
    endTime: utils.NowTime(),
    maxDemandAndTime: [],
    valueAndTime: [],
    contract_max_demand: "--",
    surplus_demand: "--",
    max_demand: "--",
    demand_time: "--",
    ec: {
      onInit: function(canvas, width, height) {
        lineChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(lineChart);
        return lineChart;
      }
    },
    flag: "block"
  },
  setPageData: function(e, startTime, endTime) {
    var page = this;
    page.setData({
      nowPower: e
    });
    return new Promise(function(resolve, reject) {
      APIService.getDemanInfo(resolve, e, page, startTime, endTime);
    });
  },
  setViewData: function() {
    var page = this;
    var contractnum = {};
    if (page.data.contract_max_demand != "--") {
      contractnum = {
        silent: true,
        label: {
          show: true,
          position: 'middle',
          formatter: '合同最大需量:' + page.data.contract_max_demand + 'KW',
          color: '#000'
        },
        lineStyle: {
          color: 'red'
        },
        data: [{
          yAxis: page.data.contract_max_demand
        }]
      }
    }
    setTimeout(function() {
      lineChart.setOption({
        title: {
          text: ''
        },
        color: ["#FF9803"],
        legend: {
          data: ['需量'],
          top: 'bottom'
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            fontSize: 8
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          name: '(KW)',
          axisLabel: {
            fontSize: 8
          },
          min: function (value) {
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
          name: '需量',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: page.data.valueAndTime,
          markLine: contractnum,
          markPoint: {
            data: [{
              type: 'max',
              name: '最大值',
              symbol: 'circle',
              symbolSize: [6, 6],
              symbolKeepAspect: true,
              itemStyle: {
                color: 'red'
              },
              label: {
                show: false,
                position: 'top',
                fontWeight: 'lighter',
                // formatter: function (data) {
                //   return parseFloat(data.data.coord[1]).toFixed(2);
                // }
              }
            }]
          },
          // label: {
          //   show: true,
          //   position: "bottom",
          //   formatter: function(data) {
          //     //console.log(data.data)
          //     return "";
          //   }
          // }
        }]
      })
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: "需量定额完成情况"
    });
    var page = this;
    this.setPageData(getApp().globalData.powerList[0], page.data.startTime, page.data.endTime).then(() => this.setViewData());
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent("#dialog");
    this.dialog.setPowerName(getApp().globalData.powerList);
    this.selectmonth = this.selectComponent("#selectmonth");
    this.selectmonth.setMonth();
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
    var page = this;
    this.setPageData(page.data.nowPower, page.data.startTime, page.data.endTime).then(() => this.setViewData());
    setTimeout(function () {
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
  },
  //监听：切换月份
  _getbutton(e) {
    //console.log(e)
    this.setData({
      startTime: utils.assignMonthFirstDay(e.detail),
      endTime: utils.assignMonthLastDay(e.detail),
    })
    this.setPageData(this.data.nowPower, this.data.startTime, this.data.endTime).then(() => this.setViewData());
  }
})