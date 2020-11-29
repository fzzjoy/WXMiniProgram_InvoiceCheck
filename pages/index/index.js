//index.js
//获取应用实例
const app = getApp()
import log from '../../utils/log.js'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    invoice_type: "",     // 发票类型
    invoice_code: "",     // 发票代码
    invoice_number: "",   // 发票号码
    invoice_total: "",    // 发票金额
    invoice_date: "",     // 发票日期
    invoice_checksum: ""  // 校验码
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  // 扫一扫
  onScan : function () {
    wx.scanCode({
      success: (res) => {
        var res_map = res.result.split(",")
        this.setData({
        invoice_code : "",
        invoice_type : "",
        invoice_number : "",
        invoice_total : "",
        invoice_date : "",
        invoice_checksum : ""
      })
        for (let index = 0; index < res_map.length; index++) {
          const element = res_map[index];
          switch(index)
          {
            case 1:
              switch (res_map[1]) {
                case "10":
                  this.setData({
                    invoice_type:"增值税电子普通发票" 
                  })
                  break;
                case "04":
                  this.setData({
                    invoice_type : "增值税普通发票"
                  })
                  break;
                case "01":
                  this.setData({
                    invoice_type : "增值税专用发票"
                  })
                  break;
                default:
                  log.error("wrong invoice type:" + res_map[1])
                  this.setData({
                    invoice_type : res_map[1]
                  })
                  break;
              }
              break;
            case 2:
              this.setData({
                invoice_code : res_map[2]
              })
              break;
            case 3:
              this.setData({
                invoice_number : res_map[3]
              })
              break;
            case 4:
              this.setData({
                invoice_total : res_map[4]
              })
              break;
            case 5:
              this.setData({
                invoice_date : res_map[5]
              })
              break;
            case 6:
              this.setData({
                invoice_checksum : res_map[6]
              })
              break;
            default:
              break;
          }
        }
      }
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
