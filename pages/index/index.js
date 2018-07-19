//index.js
//获取应用实例
const app = getApp()
var event = require('../../utils/event.js')
var APIService = require('../../utils/APIService.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CompanyGroup: "",
    count: 0,
    realdata: "",
    tipText: "加载中..."
  },
  getProdRoom: function() {
    return new Promise(function(resolve, reject) {
      APIService.redirect(resolve);
    })
  },
  getPowerInfo: function(num1, num2) {
    var page = this;
    //使用Promise,异步顺序加载
    return new Promise(function(resolve, reject) {
      APIService.getC2dRealtimeData(num1, num2, resolve, page)
    })
  },
  parseData: function(num1, num2, realdata) {
    var page = this;
    var companyInfo;
    var str = " ";
    for (var i = num1; i < (Object.keys(realdata).length + num1); i++) {
      for (var j = 0; j < getApp().globalData.prodRoom.length; j++) {
        var percent;
        if (realdata[i]!=null && "contract" in realdata[i]) {
          percent = Math.floor(((realdata[i].contract - realdata[i].real) / realdata[i].contract) * 10000) / 100 + "%";
          if (i == getApp().globalData.prodRoom[j].id) {
            companyInfo = {
              id: getApp().globalData.prodRoom[j].CUSTOMER_ID,
              company_name: getApp().globalData.prodRoom[j].company_name,
              power_name: getApp().globalData.prodRoom[j].power_name,
              maxdemand: realdata[i].real.toFixed(2),
              contractMaxDemand: realdata[i].contract,
              percent: percent
            }
          }
        } else {
          if (realdata[i] != null && i == getApp().globalData.prodRoom[j].id) {
            companyInfo = {
              id: getApp().globalData.prodRoom[j].CUSTOMER_ID,
              company_name: getApp().globalData.prodRoom[j].company_name,
              power_name: getApp().globalData.prodRoom[j].power_name,
              maxdemand: realdata[i].real.toFixed(2),
              contractMaxDemand: "",
              percent: ""
            }
          }
        }
      }
      str = str + JSON.stringify(companyInfo) + ","
    }
    var oldCompanyGroup = JSON.stringify(page.data.CompanyGroup).substring(1, JSON.stringify(page.data.CompanyGroup).length - 1)
    oldCompanyGroup = "[" + oldCompanyGroup.substring(0, oldCompanyGroup.length) + "]"
    str = "[" + str.substring(0, str.length - 1) + "]";
    page.setData({
      CompanyGroup: JSON.parse(oldCompanyGroup).concat(JSON.parse(str)),
      count: num2
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getProdRoom().then(
      () => this.getPowerInfo(1, 8).then(
        () => this.parseData(1, 8, this.data.realdata))
    );

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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      CompanyGroup: "",
      tipText: "加载中..."
    });
    this.getPowerInfo(1, 8).then(
      () => this.parseData(1, 8, this.data.realdata))
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 600);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {
    if (this.data.count < 16) {
      this.getPowerInfo(9, 16).then(
        () => this.parseData(9, 16, this.data.realdata))
    }
    if (this.data.count == 16) {
      this.getPowerInfo(17, 24).then(
        () => this.parseData(17, 24, this.data.realdata))
    }
    if (this.data.count == 24) {
      this.setData({
        tipText: ""
      })
      this.getPowerInfo(25, 28).then(
        () => this.parseData(25, 28, this.data.realdata))
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //点击“查看详情”，触发监听事件
  details: function(e) {
    getApp().globalData.companyId = e.currentTarget.dataset.companyid;
    getApp().globalData.companyName = e.currentTarget.dataset.companyname;
    APIService.getPowerListInfo();
  }

})