// pages/upload/upload.js
const db = wx.cloud.database();
const app = getApp();
const _ = db.command;
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],  
    movie_id: null,
    write_time:null,
    diary_name:null,
    avatar_image: null,
    author_name: null,
    content_sketch: null,
    content: null,
    cloud_Id:null,
    content_image:null,
  },


  formSubmit: function (e) {
    var that = this
    console.log('form发生了submit事件，携带数据为：', e);
    this.setData({
      write_time: util.formatTime(new Date()),
      diary_name: e.detail.value.diary_name,
      avatar_image: app.globalData.userInfo.avatarUrl,
      author_name: app.globalData.userInfo.nickName,
      content_sketch: e.detail.value.content_sketch,
      content:e.detail.value.content,
    });
    wx.cloud.uploadFile({
      cloudPath: "information_" + that.data.movie_id,
      filePath: that.data.files[0], // 文件路径
      success: res1 => {
        // get resource ID
        console.log("拿到cloud_ID", res1.fileID)
        that.setData({
          cloud_Id: res1.fileID,
        })
        wx.cloud.getTempFileURL({
          fileList: [res1.fileID],
          success: res2 => {
            // get temp file URL
            console.log("拿到临时路径", res2.fileList[0].tempFileURL)
            that.setData({
              content_image: res2.fileList[0].tempFileURL

            })
            db.collection("informations").doc("1").update({
              data: {
                diary_data: _.push([that.data])
              }
            })
            wx.showToast({
              title: '已提交-正在跳转',
              icon: 'success',
              duration: 1000
            })
            var timerName = setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          },
          fail: err1 => {
            console.log("位置1出错啦", err1)
          }
        })
      },
      fail: err2 => {
        console.log("位置2出错啦", err2)
        wx.showToast({
          title: '信息不能为空',
          icon: 'loading',
          duration: 1000
        })

      }
      
    }) 
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
        });
      },
    })
  },

  formReset:function(e){
    this.setData({
       files:[]
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var movie_id;
    //这里用于上传文件
    db.collection('informations').doc('1').get({
      success: function (res) {
        console.log(res)
        if (res.data.diary_data)
          {
          movie_id = res.data.diary_data.length + 1
          }
          else
          {
          movie_id=1
          }
        that.setData({
          movie_id: movie_id
        })
      },
      fail: function (res) {
        console.log("失败了",res)
      }
    })
  },
    

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})