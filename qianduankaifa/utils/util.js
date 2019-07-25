const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function draw(sharebg, shareTitle, shareCoverImg, shareQrImg, seeDate, canvas_id, nickName, headImg){
  wx.showToast({
    title: "正在下载分享图",
    icon: 'loading',
    duration: 1000,
  })

  
  // 创建画布
  const ctx = wx.createCanvasContext(canvas_id)
  // 白色背景
  ctx.setFillStyle('#fff')
  ctx.fillRect(0, 0, 300, 450)
  ctx.draw()
  // 下载底部背景图
  //wx.getImageInfo({
   // src: sharebg,
   // success: (res1) => {
     // ctx.drawImage(res1.path, 0, 250, 300, 130)
      // 下载视频封面图
      wx.getImageInfo({
        src: shareCoverImg,//没有加载到安全downloading中，所以下载不下来
         success: (res2) => {  //遗留问题，需要等待开发服务器端之后再处理
          console.log("拿到的临时的网络地址为",shareCoverImg)
           console.log("临时的本地地址为",res2)
           ctx.drawImage(res2.path, 0, 0, 300, 168)
          // 分享标题
          ctx.draw(true)
          ctx.setFillStyle('#000')  // 文字颜色：黑色
          ctx.setFontSize(20)         // 文字字号：20px
          ctx.fillText(shareTitle, 10, 200, 280) //(text,x,height,maxWidth);
          //二维码
          let qrImgSize = 140
          ctx.drawImage(shareQrImg, 80,260 , qrImgSize, qrImgSize)
          ctx.stroke()
          ctx.draw(true)

              // 用户昵称
              ctx.setFillStyle('#000')  // 文字颜色：黑色
              ctx.setFontSize(14) // 文字字号：16px
              ctx.fillText(nickName, 38, 225)
              // 观看日期
              ctx.setFillStyle('#999')  // 文字颜色：黑色
              ctx.setFontSize(10)       // 文字字号：16px
              ctx.fillText('在' + seeDate + '看过', 38, 239)
              ctx.setFillStyle('#C0C0C0')  // 文字颜色：黑色
              ctx.setFontSize(10)         // 文字字号：20px
              ctx.fillText("长按识别二维码", 100, 425) //(text,x,height,maxWidth);

              // 下载用户头像
              wx.getImageInfo({
                src: headImg,
                success: (res4) => {
                  // 先画圆形，制作圆形头像(圆心x，圆心y，半径r)
                  ctx.arc(22, 227, 12, 0, Math.PI * 2, false) //x y r 起始角 结束角
                  ctx.clip()
                  // 绘制头像图片
                  let headImgSize = 24
                  ctx.drawImage(res4.path, 10, 215, headImgSize, headImgSize)
                  console.log("头像的本地临时地址",res4.path)
                  // ctx.stroke() // 圆形边框
                 // ctx.draw(true)
                  ctx.draw(true, setTimeout(function () {
                    wx.canvasToTempFilePath({
                      canvasId: 'shareCanvas',
                      success: function (res) {
                        console.log(res)
                      },
                    })
                  }, 1000));

              
                  
                 
                  // 保存到相册
                  wx.canvasToTempFilePath({
                    canvasId:canvas_id,
                    success: function (res) {
                      wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function (res) {
                          wx.showToast({
                            title: '分享图片已保存到相册',
                            duration:2000
                          })
                        }
                      })
                    }
                  }, this)
                },
              })      
        }
      })
}




module.exports = {
  formatTime: formatTime,
  draw:draw,
  formatNumber: formatNumber,

}
