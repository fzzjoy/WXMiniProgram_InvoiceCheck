//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database() // 获取数据库引用
const invoice_db = db.collection("invoices")

import log from '../../utils/log.js'
import { formatTime } from '../../utils/util.js'

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
    invoice_checksum: "", // 校验码
    record_info: ""       // 录入成功与否
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

  // 录入数据库
  onRecord : function() {
    this.setData({
      record_info: ""
    })
    
    console.log("thi.data.hasUserInfo:", this.data.hasUserInfo)
    if(!this.data.hasUserInfo)
    {
      wx.showToast({
        title: '请先点击用户登录',
        icon: 'none',
        duration: 1000
      })
      return
    }
    invoice_db.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _id: this.data.invoice_code + "+" + this.data.invoice_number, 
        type: this.data.invoice_type,
        total: this.data.invoice_total,
        invoice_date: this.data.invoice_date,
        checksum: this.data.invoice_checksum,
        recorder: app.globalData.userInfo.nickName,
        record_date: formatTime(new Date())
      },
      success:  res => {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        this.setData({
          record_info: "录入成功，录入人：" + app.globalData.userInfo.nickName
        })
      },

      fail: res => {
        console.log(res)
        var info = ""
        if(res.errCode == -502001) {
          info = "数据已存在"
        }
        else {
          info = res.errMsg
        }
        this.setData({
          record_info: "录入失败，ERROR[" + res.errCode + "]:" + info
        })
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
