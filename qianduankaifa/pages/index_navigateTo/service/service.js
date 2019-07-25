// pages/main/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: [
      {
        name: "页面1",
        selected: true
      },
      {
        name: "页面2",
        selected: false
      },
      {
        name: "页面3",
        selected: false
      },
    ],
    tabbarHeight: 50, // 底部tabbar高度
    activeIndex: 1,  // 选中的tab

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.tabbar[0].name,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.updateSubPageShowHide(this.data.activeIndex);
  },
  /**
 * 生命周期函数--监听页面隐藏
 */
  onHide: function () { },

  onChange(event) {
    if (event.detail == this.data.activeIndex)
      return;
    this.updateSubPageShowHide(event.detail);
    console.log("点击事件信息",event)
    this.setData({
      activeIndex: parseInt(event.currentTarget.dataset.postid),
    })
  },


  // 更新组件的show hide 生命周期
  updateSubPageShowHide(currentIndex) {
    this.data.tabbar.forEach(function (value, i) {
      if (i == currentIndex) {
        value.selected = true;
        wx.setNavigationBarTitle({
          title: value.name,
        })
      } else {
        value.selected = false;
      }
    })
    this.setData({
      tabbar: this.data.tabbar,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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