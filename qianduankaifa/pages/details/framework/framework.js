// pages/details/framework/framework.js
var datas = require('../../../data/diary_data.js');
var method = require('../../../utils/util.js');
var app = getApp()
var obj = {}
const db = wx.cloud.database();
Page({

  data: {
    listArray: {},
    flag: null,
    id: null,
  },


  onLoad: function (options) {
    var that = this;
    var id = JSON.parse(options.id); //文章对应的id，由trends页面传来
    var type = JSON.parse(options.type);
    var flag = null;
    var source=null;
    if(type=="1")
      {
        source="ariticles"
      }
    else if (type == "2")
      {
        source="informations"
      }
    db.collection(source).get({
      success: function (res) 
      {
        let temp = res.data[0].diary_data[id - 1];  //id为1，对应数组元素0
        console.log("传入framework页面的id为",id);

        wx.getStorage({
          key: 'state',
          success: function (res) {
            flag = res.data[id]; //true or false
            that.setData({
              listArray: temp, 
              flag: flag, //前一个flag是data对象了里的属性，后一个flag是onload function里面的变量
              id: id
            });
            console.log("用于本页面渲染用的listArray的值为", that.data.listArray)
          },
          fail: function (res) 
          { //第一次调用一定会失败，因为本身里面没有值，干脆就直接再fali回调函数里赋值了
          wx.setStorage({key:'state',data:{}})
        //定义一个空对象，否则下面调用'state'储存时，会调用失败的。
          that.setData({
            flag: false,
            listArray: temp,
            id: id
          })
          }
        })

      
      }
    })
  },


  //收藏逻辑实现
  handlecollection: function () {
    var that = this;
    let flag = !this.data.flag;
    this.setData({
      flag
    })
    let title = flag ? "收藏成功" : "取消收藏";
    wx.showToast({
      title,
      icon: 'success',
    });

    wx.getStorage({
      key: "state",
      success: function (res) {
        obj = res.data;
        console.log(obj, typeof obj, "从本地储存中读取的");
        obj[that.data.id] = flag;
        console.log(obj, typeof obj, "写入本地储存的");
        wx.setStorage({
          key: "state",
          data: obj,
          success: function () {
            console.log("success")
          }
        })
      },
      fail: function (res) {
        console.log(res + "调用失败");
      }
    })
  },




  share: function () {

    let sharebg = 'http://qiniu.jnwtv.com/H520181206092255188568494.png' // 分享底部背景图
    let shareTitle = this.data.listArray.diary_name// 分享标题
    let shareCoverImg = this.data.listArray.content_image // 分享封面图

    let shareQrImg = '../../../images/gh_3bbec0c778b5_258.jpg'// 分享小程序二维码

    let headImg = app.globalData.userInfo.avatarUrl //用户头像
    console.log("头像的网络路径", headImg)
    let nickName = app.globalData.userInfo.nickName// 昵称

    let seeDate = method.formatNumber(method.formatTime(new Date()))//看视频日期
    console.log(seeDate, typeof seeDate)
    let canvas_id = "shareCanvas";

    method.draw(sharebg, shareTitle, shareCoverImg, shareQrImg, seeDate, canvas_id, nickName, headImg)
  },

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