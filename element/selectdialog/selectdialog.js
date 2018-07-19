Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '请选择' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    content: {
      type: Object,
      value: ""
    },
    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '确定'
    },
    power_id: {
      type: String,
      value: ""
    },
    power_name: {
      type: String,
      value: ""
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false,
    last: "<",
    next: ">",
    powerInfo: {},
    lastbutton: true,
    nextbutton: false
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    setPowerName(e) {
      //console.log(e.length)
      if (e.length == 1) {
        this.setData({
          nextbutton: true
        })
      }
      this.setData({
        powerInfo: e,
        power_id: e[0].power_id,
        power_name: e[0].power_name
      })
      //console.log(this.data.powerInfo)
    },
    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: false
      })
    },
    //展示弹框
    _showDialog() {
      this.setData({
        content: getApp().globalData.powerList,
        isShow: true,
      })
      //console.log(this.data.content)
      this.triggerEvent("showDialog");
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent(e) {
      //触发取消回调
      this.hideDialog();
      this.triggerEvent("cancelEvent");
    },
    _confirmEvent(e) {
      //触发成功回调
      //console.log(e.detail.value.radiogroup)
      this.myConfirmEvent(e.detail.value.radiogroup)
      this.hideDialog();
    },
    //点击上一个按钮
    lastbutton(e) {
      var power_id = parseInt(e.currentTarget.dataset.powerid) - 1
      this.myConfirmEvent(power_id)
    },
    //点击下一个按钮
    nextbutton(e) {
      var power_id = parseInt(e.currentTarget.dataset.powerid) + 1
      this.myConfirmEvent(power_id)
    },
    myConfirmEvent(power_id) {
      if (getApp().globalData.powerList.length != 1) {
        if (power_id == getApp().globalData.powerList[0].power_id) {
          this.setData({
            lastbutton: true,
            nextbutton: false
          })
        } else if (power_id == getApp().globalData.powerList[getApp().globalData.powerList.length - 1].power_id) {
          this.setData({
            lastbutton: false,
            nextbutton: true
          })
        } else {
          this.setData({
            lastbutton: false,
            nextbutton: false
          })
        }
      } else {
        this.setData({
          lastbutton: true,
          nextbutton: true
        })
      }
      for (var i = 0; i < getApp().globalData.powerList.length; i++) {
        if (power_id == getApp().globalData.powerList[i].power_id) {
          this.setData({
            power_id: getApp().globalData.powerList[i].power_id,
            power_name: getApp().globalData.powerList[i].power_name
          })
          this.triggerEvent("confirmEvent", getApp().globalData.powerList[i]);
        }
      }
    }
  }
})