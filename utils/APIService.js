var utils = require('../utils/util.js');
//登录验证成功后首页,主要获取设备选择器的数据
function redirect(resolve) {
  wx.request({
    url: getApp().globalData.Base_Url + '/rest/api/systeminfo/redirect',
    header: getApp().globalData.header,
    success: function(e) {
      resolve(getApp().globalData.prodRoom = e.data.prodRoom)
    }
  });
}

//获取首页的实时数据 需量值
function getC2dRealtimeData(num1, num2, resolve, page) {
  var str = "";
  for (var i = num1; i < num2; i++) {
    str = str + i + ",";
  }
  str = str + num2;
  wx.request({
    url: getApp().globalData.Base_Url + '/rest/api/realtime/getC2dRealtimeData',
    header: getApp().globalData.header,
    data: {
      powerIds: str
    },
    success: function(res) {
      resolve(
        page.setData({
          realdata: res.data.realdata
        })
      )
    }
  });
}

//获取首页的所有实时数据 实时告警预警
function getC2dAllRealtimeData(resolve, page) {
  wx.request({
    url: getApp().globalData.Base_Url + '/rest/api/realtime/getC2dRealtimeData',
    header: getApp().globalData.header,
    data: {
      powerIds: '1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28'
    },
    success: function(res) {
      resolve(
        page.setData({
          totalMap: res.data.totalMap,
          bottomList: res.data.bottomList,
        })
      )
      for (var i = 0; i < page.data.bottomList.length; i++) {
        var str = "bottomList[" + i + "].time";
        var str2 = "bottomList[" + i + "].value";
        resolve(
          page.setData({
            [str]: utils.timestampToTime(page.data.bottomList[i].time),
            [str2]: parseFloat(page.data.bottomList[i].value).toFixed(2)
          })
        )
      }
    }
  });
}

//获取公司的监测点信息
function getPowerListInfo() {
  wx.request({
    url: getApp().globalData.Base_Url + '/rest/api/systeminfo/redirect?companyId=' + getApp().globalData.companyId + '&isGroup=false',
    header: getApp().globalData.header,
    success: function(e) {
      //console.log(e)
      getApp().globalData.powerList = e.data.powerList;
      for (var i = 0; i < getApp().globalData.powerList.length; i++) {
        if (!("MAX_DEMAND" in getApp().globalData.powerList[i])) {
          getApp().globalData.powerList[i] = JSON.parse(JSON.stringify(getApp().globalData.powerList[i]).substring(0, JSON.stringify(getApp().globalData.powerList[i]).length - 1) + ',"MAX_DEMAND":"0"}')
        }
      }
      wx.navigateTo({
        url: '../home/home'
      })
    }
  })
}

//月电费清单
function getElecCost(resolve, powerInfo, page, startTime, endTime) {
  wx.request({
    url: getApp().globalData.Base_Url + '/rest/api/charge/DegreeFeeStructure',
    data: {
      CompanyId: getApp().globalData.companyId,
      DeviceId: powerInfo.power_id,
      IsMaxDemand: false,
      MaxDemand: powerInfo.MAX_DEMAND,
      Capacity: powerInfo.capacity,
      StartTime: startTime,
      EndTime: endTime,
      isGroup: powerInfo.is_group
    },
    success: function(e) {
      wx.showNavigationBarLoading()
      setTimeout(function() {
        wx.hideNavigationBarLoading()
      }, 1000);
      if (e.data.data.company == null) {
        resolve(
          page.setData({
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
          }))
      } else {
        resolve(
          page.setData({
            company: e.data.data.company,
            basic_price: Math.floor(e.data.data.company[0][0] / e.data.data.company[1][0] * 100) / 100,
            peak_price: Math.floor(e.data.data.company[0][1] / e.data.data.company[1][1] * 100) / 100,
            flat_price: Math.floor(e.data.data.company[0][2] / e.data.data.company[1][2] * 100) / 100,
            valley_price: Math.floor(e.data.data.company[0][3] / e.data.data.company[1][3] * 100) / 100,
            standard09_factor: Math.floor(e.data.data.company[0][4] / e.data.data.company[0][5] * 10000) / 100,
            basic_proportion: Math.floor(e.data.data.company[0][0] / e.data.data.company[0][5] * 10000) / 100 + "%",
            peak_proportion: Math.floor(e.data.data.company[0][1] / e.data.data.company[0][5] * 10000) / 100 + "%",
            flat_elec_proportion: Math.floor(e.data.data.company[0][2] / e.data.data.company[0][5] * 10000) / 100 + "%",
            valley_elec_proportion: Math.floor(e.data.data.company[0][3] / e.data.data.company[0][5] * 10000) / 100 + "%",
            coefficient_proportion: Math.floor(e.data.data.company[0][4] / e.data.data.company[0][5] * 10000) / 100 + "%"
          })
        )
      }
    }
  })
}

//需量管控、需量定额完成情况
function getDemanInfo(resolve, powerInfo, page, startTime, endTime) {
  wx.request({
    url: getApp().globalData.Base_Url + '/rest/api/quota/getDemandLineData',
    data: {
      CompanyId: getApp().globalData.companyId,
      StartDate: startTime,
      EndDate: endTime,
      GroupId: powerInfo.power_id,
      isGroup: powerInfo.is_group
    },
    success: function(e) {
      wx.showNavigationBarLoading()
      setTimeout(function() {
        wx.hideNavigationBarLoading()
      }, 1000);
      if (e.data.error == "demand data not found") {
        resolve(
          page.setData({
            maxDemandAndTime: [],
            valueAndTime: [],
            contract_max_demand: "--",
            surplus_demand: "--",
            max_demand: "--",
            demand_time: "--"
          })
        );

      } else {
        if (powerInfo.MAX_DEMAND != 0) {
          resolve(
            page.setData({
              maxDemandAndTime: e.data.maxDemandAndTime,
              valueAndTime: e.data.valueAndTime,
              contract_max_demand: powerInfo.MAX_DEMAND,
              surplus_demand: (powerInfo.MAX_DEMAND - e.data.maxDemandAndTime[1]).toFixed(2),
              max_demand: e.data.maxDemandAndTime[1].toFixed(2),
              demand_time: utils.timestampToTime(e.data.maxDemandAndTime[0])
            })
          );
        } else {
          resolve(
            page.setData({
              maxDemandAndTime: e.data.maxDemandAndTime,
              valueAndTime: e.data.valueAndTime,
              max_demand: e.data.maxDemandAndTime[1].toFixed(2),
              demand_time: utils.timestampToTime(e.data.maxDemandAndTime[0])
            }));
        }
      }
    }
  })
}

//功率、需量查询与统计
function getPowerAndDemand(resolve, powerInfo, page, startTime, endTime) {
  wx.request({
    url: getApp().globalData.Base_Url + '/rest/api/degree/getGroupPowerStatistic',
    data: {
      CompanyId: getApp().globalData.companyId,
      ItemId: powerInfo.power_id,
      IndexType: "device",
      StartDate: startTime,
      EndDate: endTime
    },
    success: function(e) {
      wx.showNavigationBarLoading()
      setTimeout(function() {
        wx.hideNavigationBarLoading()
      }, 1000);
      var strdemand = powerInfo.power_id + "_demand";
      var strpower = powerInfo.power_id + "_power";
      resolve(
        page.setData({
          FPDemand: e.data.data[strdemand].FPDemand,
          P0: e.data.data[strpower].P0
        })
      )
    }
  })
}

//实时- 电量、功率与需量实时监测 用于获取三个图的数据
function getElecPowerDemandJsonBean(resolve, powerInfo, page) {
  wx.request({
    url: getApp().globalData.Base_Url + '/rest/api/currentEpi/getPowerAndEqiData',
    data: {
      CompanyId: getApp().globalData.companyId,
      indexId: powerInfo.power_id,
      indexType: "device",
      keys: {
        "electricaldegrees": null,
        "power": null,
        "demandcurve": null,
        "powerfactor": null
      }
    },
    success: function(e) {
      wx.showNavigationBarLoading()
      setTimeout(function() {
        wx.hideNavigationBarLoading()
      }, 1000);
      resolve(
        page.setData({
          FPdemand: e.data.data.demandcurve.FPdemand,
          P0: e.data.data.power.P0,
          PFT: e.data.data.powerfactor.PFT,
          epi: e.data.data.electricaldegrees.epi,
        })
      )
    }
  })
}

//电量统计与查询
function getElecQueryStat(resolve, powerInfo, page, startTime, endTime, dayType) {
  wx.request({
    url: getApp().globalData.Base_Url + '/rest/api/degree/getElectricityByDateType',
    header: getApp().globalData.header,
    data: {
      CompanyId: getApp().globalData.companyId,
      CustomerType: null,
      StartTime: startTime,
      EndTime: endTime,
      DayType: dayType,
      GroupInfo: [{
        "itemid": powerInfo.power_id,
        "name": powerInfo.power_id + "：" + powerInfo.power_name,
        "isGroup": false,
        "deviceid": powerInfo.power_id + ""
      }]
    },
    success: function(e) {
      //console.log(e.data.data)

      if (dayType == "day") {
        resolve(page.setData({
          dayData: e.data.data
        }));
      }
      if (dayType == "month") {
        resolve(
          page.setData({
            monthData: e.data.data
          })
        );
      }
      if (dayType == "year") {
        resolve(
          page.setData({
            yearData: e.data.data
          })
        );
      }

      wx.showNavigationBarLoading()
      setTimeout(function() {
        wx.hideNavigationBarLoading()
      }, 1000);
    }
  })
}
module.exports = {
  redirect: redirect,
  getC2dRealtimeData: getC2dRealtimeData,
  getC2dAllRealtimeData: getC2dAllRealtimeData,
  getPowerListInfo: getPowerListInfo,
  getElecCost: getElecCost,
  getDemanInfo: getDemanInfo,
  getPowerAndDemand: getPowerAndDemand,
  getElecPowerDemandJsonBean: getElecPowerDemandJsonBean,
  getElecQueryStat: getElecQueryStat
}