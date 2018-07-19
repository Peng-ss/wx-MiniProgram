// pages/modules/elecCostList/elecCostList.js
var utils = require('../../../utils/util.js');
var APIService = require('../../../utils/APIService.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: utils.MonthFirstDay(),
    endTime: utils.NowTime(),
    nowPower: {},
    company: {},
    basic_price: "--",
    peak_price: "--",
    flat_price: "--",
    valley_price: "--",
    standard09_factor: "--",
    basic_proportion: "--",
    peak_proportion: "--",
    flat_elec_proportion: "--",
    valley_elec_proportion: "--",
    coefficient_proportion: "--"
  },
  setPageData: function(e, startTime, endTime) {
    var page = this;
    page.setData({
      nowPower: e
    })
    return new Promise(function (resolve, reject) {
      APIService.getElecCost(resolve,e, page, startTime, endTime);
    });
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: "月电费清单"
    });
    this.setPageData(getApp().globalData.powerList[0], this.data.startTime, this.data.endTime)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    this.setPageData(this.data.nowPower, this.data.startTime, this.data.endTime);
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
  onReady: function() {
    //获得自定义组件
    this.dialog = this.selectComponent("#dialog");
    this.dialog.setPowerName(getApp().globalData.powerList);
    this.selectmonth = this.selectComponent("#selectmonth");
    this.selectmonth.setMonth();
  },
  showDialog() {
    this.dialog.showDialog();
  },
  //监听：切换监测点
  _confirmEvent(e) {
    //console.log(e);
    this.setPageData(e.detail, this.data.startTime, this.data.endTime);
    this.dialog.hideDialog();
  },
  //监听：切换月份
  _getbutton(e) {
    this.setData({
      startTime: utils.assignMonthFirstDay(e.detail),
      endTime: utils.assignMonthLastDay(e.detail),
    })
    this.setPageData(this.data.nowPower, this.data.startTime, this.data.endTime);
  }
})