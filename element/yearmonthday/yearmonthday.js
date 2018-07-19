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
    nowdate: utils.NowTime(),
    date: utils.NowTime().substring(0, 10),
    dateType: "day"
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    radioChange(e) {
      //console.log(e)
      switch (e.detail.value) {
        case "day":
          this.setData({
            dateType: e.detail.value
          })
          break;
        case "month":
          this.setData({
            dateType: e.detail.value
          })
          break;
        case "year":
          this.setData({
            dateType: e.detail.value
          })
          break;
      }
    },
    bindDateChange(e) {
      this.setData({
        date: e.detail.value
      })
      this.triggerEvent("getdate", this.data.date)

    }
  }
})