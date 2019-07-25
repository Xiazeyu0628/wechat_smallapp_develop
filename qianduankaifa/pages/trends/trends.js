// pages/trends/trends.js
//js文件中只能用相对路径去找    
var datas=require('../../data/diary_data.js');
const db = wx.cloud.database();
console.log(datas,typeof datas);
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listArray:[
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    db.collection('ariticles').get({
    success: function(res) {
    let  listArray = res.data[0].diary_data
      console.log(res.data[0].diary_data)
      console.log(listArray)
      that.setData({
        listArray: listArray
      })
  }
})  
    
   
    
  
  },

  goto: function (event) {
      console.log(event);
      console.log(event.currentTarget.id);
    let id = JSON.stringify(event.currentTarget.dataset.id);
    let type = JSON.stringify(event.currentTarget.dataset.type);
    wx.navigateTo({
      url: '../details/framework/framework?id=' + id + '&type=' + type,
    })
  },

  /*goto:function(){
    let id = JSON.stringify(listArray[index].movie_id);
    wx.navigateTo({
      url: '../datails/framework/framework?id='+id,
    })
  },
*/

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