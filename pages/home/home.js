// pages/home/home.js
var event = require('../../utils/event.js');
var utils = require('../../utils/util.js');
var APIService = require('../../utils/APIService.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MAX_DEMAND: "0",
    currentTab: 0,
    color: [
      "#3498db", "#000000", "#000000", "#000000"
    ],
    img: [
      "/img/indexselect.png", "/img/ele.png", "/img/alarm.png", "/img/mine.png"
    ],
    minheight: "1110",
    totalMap: [],
    bottomList: []
  },
  setPageData: function() {
    var page = this;
    return new Promise(function(resolve, reject) {
      APIService.getC2dAllRealtimeData(resolve, page);
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    //console.log(getApp().globalData.powerList);
    wx.setNavigationBarTitle({
      title: getApp().globalData.companyName
    });
    this.setPageData();
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
    //console.log(getCurrentPages())
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
  //事件处理函数
  // 电量、功率与需量实时监测
  ElecPowerDemand: function() {
    wx.navigateTo({
      url: '../modules/elecpowerdemand/elecpowerdemand'
    })
  },
  //需量管控
  DemandControl: function() {
    wx.navigateTo({
      url: '../modules/demandcontrol/demandcontrol'
    })
  },
  //功率与需量查询与统计
  PowerandDemand: function() {
    wx.navigateTo({
      url: '../modules/poweranddemand/poweranddemand'
    })
  },
  //月电费清单
  ElecCostList: function() {
    wx.navigateTo({
      url: '../modules/elecCostList/elecCostList'
    })
  },
  //需量定额完成情况
  DemandQuota: function() {
    wx.navigateTo({
      url: '../modules/demandquota/demandquota?'
    })
  },
  //电量统计与查询
  ElecQueryStat:function(){
    wx.navigateTo({
      url: '../modules/elecquerystat/elecquerystat',
    })
  },
  //滑动切换
  swiperTab: function(e) {
    var page = this;
    //console.log(e)
    page.setData({
      currentTab: e.detail.current
    });
    page.setTabCss(page.data.currentTab)
  },
  //点击切换
  clickTab: function(e) {
    var page = this;
    //console.log(e)
    if (page.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      page.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
    page.setTabCss(page.data.currentTab)
  },
  setTabCss: function(currentTab) {
    var page = this;
    switch (currentTab) {
      case 0:
        page.setData({
          color: [
            "#3498db", "#000000", "#000000", "#000000"
          ],
          img: [
            "/img/indexselect.png", "/img/ele.png", "/img/alarm.png", "/img/mine.png"
          ],
          minheight: "1110"
        })
        break;
      case 1:
        page.setData({
          color: [
            "#000000", "#3498db", "#000000", "#000000"
          ],
          img: [
            "/img/index.png", "/img/eleselect.png", "/img/alarm.png", "/img/mine.png"
          ],
          minheight: "1110"
        })
        break;
      case 2:
        page.setData({
          color: [
            "#000000", "#000000", "#3498db", "#000000"
          ],
          img: [
            "/img/index.png", "/img/ele.png", "/img/alarmselect.png", "/img/mine.png"
          ],
          minheight: 220 * page.data.bottomList.length + 320
        })
        break;
      case 3:
        page.setData({
          color: [
            "#000000", "#000000", "#000000", "#3498db"
          ],
          img: [
            "/img/index.png", "/img/ele.png", "/img/alarm.png", "/img/mineselect.png"
          ],
          minheight: "1110"
        })
        break;
    }
  }
})