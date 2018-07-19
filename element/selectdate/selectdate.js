var utils = require('../../utils/util.js');

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {

  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    isShow: false,
    nowdate: utils.NowTime(),
    date1: utils.GetYesterday(),
    date2: utils.NowTime(),
    dateconfirm: {
      first: utils.GetYesterday(),
      second: utils.NowTime()
    }
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    showselectview(e) {
      this.setData({
        isShow: true,
      })
    },
    //确定
    btn_confirm(e) {
      //console.log(e)
      this.setData({
        isShow: false,
        date1: e.currentTarget.dataset.fdate,
        date2: e.currentTarget.dataset.sdate,
        dateconfirm: {
          first: e.currentTarget.dataset.fdate,
          second: e.currentTarget.dataset.sdate
        }

      })
      this.triggerEvent("cancelDateEvent", this.data.dateconfirm)
    },
    //日期选择器1
    bindDate1Change(e) {
      var str = e.detail.value + " " + "00:00:00";
      if (utils.timeToTimestamp(str) < utils.timeToTimestamp(this.data.date2)) {
        this.setData({
          date1: str
        })
      } else {
        wx.showToast({
          title: '开始时间大于等于结束时间',
          icon: 'none',
          duration: 2000
        })
      }
    },
    //日期选择器2
    bindDate2Change(e) {
      var str = e.detail.value + " " + "23:59:59"
      if (utils.timeToTimestamp(this.data.date1) < utils.timeToTimestamp(str)) {
        this.setData({
          date2: str
        })
      } else {
        wx.showToast({
          title: '开始时间大于或者等于结束时间',
          icon: 'none',
          duration: 2000
        })
      }
    },
    //取消
    btn_cancel() {
      this.setData({
        isShow: false
      })
    },
    today() {
      this.setData({
        date1: utils.NowTime().substring(0, 10) + " " + "00:00:00",
        date2: utils.NowTime()
      })
    },
    yesterday() {
      this.setData({
        date1: utils.GetYesterday().substring(0, 10) + " " + "00:00:00",
        date2: utils.GetYesterday().substring(0, 10) + " " + "23:59:59"
      })
    },
    lastthreedays() {
      this.setData({
        date1: utils.LastThreedays(),
        date2: utils.NowTime()
      })
    },
    month() {
      this.setData({
        date1: utils.MonthFirstDay(),
        date2: utils.NowTime()
      })
    }

  }
})