import * as echarts from '../../../ec-canvas/echarts';
var utils = require('../../../utils/util.js');
var APIService = require('../../../utils/APIService.js');
var lineChart = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    startTime: utils.GetYesterday(),
    endTime: utils.NowTime(),
    nowPower: {},
    max_demand:"",
    FPDemand: [],
    P0: [],
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
      nowPower: e,
      max_demand: e.MAX_DEMAND
    });
    return new Promise(function(resolve, reject) {
      APIService.getPowerAndDemand(resolve, e, page, startTime, endTime);
    });
  }, 
  setViewData:function(){
    var page = this;
    var contractnum = {};
    if (page.data.max_demand != 0) {
      contractnum = {
        silent: true,
        label: {
          show: true,
          position: 'middle',
          formatter: '合同最大需量:' + page.data.max_demand + 'KW',
          color: '#000'
        },
        lineStyle: {
          color: 'red'
        },
        data: [{
          yAxis: page.data.max_demand
        }]
      }
    }
    setTimeout(function () {
      lineChart.setOption({
        title: {
          text: ''
        },
        color: ["#FF9803","#67C13D"],
        legend: {
          data: ['有功功率','需量曲线'],
          top: 'bottom'
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            interval: 2,
            fontSize :8,
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          name: '功率曲线(KW)',
          axisLabel: {
            fontSize: 8
          },
          min: function (value) {
            return parseInt(value.min-200);
          },
          max: function (value) {
            return parseInt(value.max + 200);
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
          data: page.data.P0
        },
          {
            name: '需量曲线',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: page.data.FPDemand,
            markLine: contractnum
          }]
      })
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    wx.setNavigationBarTitle({
      title: "功率与需量查询与查询"
    });
    this.setPageData(getApp().globalData.powerList[0], this.data.startTime, this.data.endTime).then(() => this.setViewData());
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent("#dialog");
    this.dialog.setPowerName(getApp().globalData.powerList);
    this.selectdate = this.selectComponent("#selectdate");
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
  //监听：选择日期
  _cancelDateEvent: function(e) {
    this.setData({
      startTime: e.detail.first,
      endTime: e.detail.second
    })
    var page = this;
    this.setPageData(page.data.nowPower, page.data.startTime, page.data.endTime).then(() => this.setViewData());
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