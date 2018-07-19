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
    mon: {}
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    //选中月份变色
    monthColor(nowmon, appointmon){
      var str = "";
      for (var i = nowmon; i > 0; i--) {
        if (appointmon == i) {
          str = str + '["' + i + '","' + i + '月"' + ',"2196F3","fff' + '"],';
        } else {
          str = str + '["' + i + '","' + i + '月"' + ',"888888","000' + '"],';
        }

      }
      str = '[' + str.substring(0, str.length - 1) + ']'
      this.setData({
        mon: JSON.parse(str)
      })
    },
    setMonth() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      //month = 12;
      this.monthColor(month, month)
    },
    _getbutton(e) {
      //console.log(e.currentTarget.dataset.datamon);
      this.monthColor(this.data.mon.length, e.currentTarget.dataset.datamon)
      this.triggerEvent("_getbutton", e.currentTarget.dataset.datamon)
    }
  }
})