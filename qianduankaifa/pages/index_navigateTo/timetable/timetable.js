// pages/timetable/timetable.js
var deliever_datas = require('../../../data/todolist.js');
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //日历设置
    calendarConfig: {
      multi: false, // 是否开启多选,
      inverse: true, // 单选模式下是否支持取消选中,
      takeoverTap: false, // 是否完全接管日期点击事件，配合 onTapDay() 使用
      disablePastDay: false, // 是否禁选过去的日期
      firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: true, 
      noDefault: false,
      focus: false,
      // 日历面板是否只显示本月日期
      /**
       * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
       * 注意：若想初始化时不默认选中当天，则将该值配置为除 undefined 以外的其他非值即可，如：空字符串, 0 ,false等。
      */
    //  defaultDay: '2019-3-6', // 初始化后是否默认选中指定日期
        // 初始化后是否自动选中当天日期，优先级高于defaultDay配置，两者请勿一起配置    
    },
    //如果像每次初始化时，都能看到这个页面的变化，就不能放在将数据放在data里

    todolist:{},
    listArray:[],  //选中日期的代办列表
    delBtnWidth: 180,//删除按钮宽度单位（rpx）
    selectedyear:null,
    selectedmonth:null,
    selectedday: null,
    date_string:null,
  },
  



 
 //-----------日历组建方法--------//

 //选择日期后执行的事件
  afterTapDay(e) {
    var that =this;
    console.log('afterTapDay', e.detail); // => { currentSelect: {}, allSelectedDays: [] }
    //产生本地储存中对象的属性名字符串
    let date_string = this.dateint2String(e.detail.year, e.detail.month, e.detail.day);
    console.log("选择的日期为", date_string, typeof date_string);
    this.setData({
      selectedyear: e.detail.year,
      selectedmonth: e.detail.month,
      selectedday: e.detail.day,
      date_string: date_string,
    });
    console.log("todolist的值为",this.data.todolist)
    console.log("选择的日期的listArray的值为",this.data.todolist[date_string])
    //从本地数据中读取信息到待办事项列表
    if (this.data.todolist[date_string]==null)
    {
      console.log("执行了赋值为空的语句")
      this.setData({
        listArray: [],
      })
    }
    else{
    this.setData({
      listArray: that.data.todolist[date_string],
    })
    }  
  },



  /**
   * 当改变月份时触发  current 当前年月  next 切换后的年月
   */
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail); // => { current: { month: 3, ... }, next: { month: 4, ... }}
  },


  /**
   * 日期点击事件（此事件会完全接管点击事件），需自定义配置 takeoverTap 值为真才能生效
   * currentSelect 当前点击的日期
   */
  onTapDay(e) {
    console.log('onTapDay', e.detail);
    console.log(this.calendar.getSelectedDay()); 
    
  },


  /**
   * 日历初次渲染完成后触发事件，如设置事件标记 相当于onload了
   */
  afterCalendarRender(e) {
    var that = this;
    //动作1：从云端读取数据
    db.collection("todos").get().then(res => {
    console.log("从云端获取的数据为", res)
   
    //动作2：将数据放入本地的todolist{}中,todolist{}是数据的总入口
    console.log("总的todolist的表",res.data[0]);
    this.setData({
     todolist: res.data[0],
    })

    //动作3：再从todolist中读取存入listArrary[]中
   
    //console.log('afterCalendarRender', e);

    //找到今天选中的日期
    let date_string = this.dateint2String(e.detail.data.calendar.selectedDay[0].year, e.detail.data.calendar.selectedDay[0].month, e.detail.data.calendar.selectedDay[0].day)
    this.setData({
      selectedyear: e.detail.data.calendar.selectedDay[0].year,
      selectedmonth: e.detail.data.calendar.selectedDay[0].month,
      selectedday: e.detail.data.calendar.selectedDay[0].day,
      date_string: date_string,
    })
    //如果当天的listArray本身没有定义的话，那就赋值为空，否则下方报错
    if (this.data.todolist[date_string] == null) {
        this.setData({
          listArray: [],
        })
      }
      else {
        this.setData({
          listArray: that.data.todolist[date_string],
        })
      }  


    //动作4：再从todolist中读取存入days[]中，进行日历渲染
      var prop = Object.getOwnPropertyNames(this.data.todolist);
      console.log("prop的值", prop, typeof prop);
      //prop是一个数组，数组里的项为todolist对象里的属性
      // prop.length的物理意义为 安排了代办事项的天数
      for (let i = 0; i < prop.length-2; i++) {
        let date_information = this.datestring2int(prop[i])//返回的是 [year, month, day],一个日期值
        let days = [];
        for (let k = 0; k < this.data.todolist[prop[i]].length; k++) {
          //that.data.todolist[prop[i]].length 是一个日期属性下数组的长度
          //物理意义为：在特定日期值下的代办事件的个数
          //console.log(this.data.todolist[prop[i]].length);
          //k代表的是第几个待办事项
          days[k] = {
            year: date_information[0],
            month: date_information[1],
            day: date_information[2],
            todoText: that.data.todolist[prop[i]][k].todoitem,
          }
        }
        console.log("days对象的值为", days);
        this.calendar.setTodoLabels({
          // 待办点标记设置
          pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
          dotColor: '#40', // 待办点标记颜色
          // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
          circle: true, // 待办
          days: days,
        });
      }
    })
},

  

  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
  bindFormSubmit: function (src) {   //一个提交包含两个动作—
    var that =this;
    this.setData({
      focus: false
    });
    console.log(src.detail.value.textarea);
    //动作1:更新日历——更新本地的日列事项 days[]
    this.calendar.setTodoLabels({ 
      pos: 'bottom', 
      dotColor: '#40', 
      circle: true, 
      days: [{
        year: that.data.selectedyear,
        month: that.data.selectedmonth,
        day: that.data.selectedday,
        todoText: src.detail.value.textarea,
      }],
    });
    //动作2：更新列表——更新本地的待办事项列表listArrary[]

    let obj = {
      todoitem:src.detail.value.textarea,
      txtStyle: "",
    }
    let listArray = this.data.listArray;
    listArray.splice(0, 0, obj);
    let todolist = this.data.todolist;
    let date_string = this.data.date_string;

    //更新列表的状态
    this.setData({
      listArray: listArray,
    });
   todolist[date_string]=listArray;//setdata只用于前端渲染的同步 ，这里仅仅为了更新后面的todolist的值
    
    //动作3：更新云端服务器
   
    let obj2={}
      obj2[date_string]=listArray;
    
   
    db.collection("todos").doc("b6e3a09f-65d6-4672-9840-3c6d914a5d66").update({
      data:obj2,
      success:function(res){
          console.log("更新成功",res)
      }
    })

  },

  bindItemdel:function(e){   //一个删除事件包含两个动作
    var that = this;
    //动作1：删除本地listArray里的数据，前端列表自动渲染
    let index = e.target.dataset.index;
    let listArray = this.data.listArray;
    //移除列表中下标为index的项
    listArray.splice(index, 1);
    //更新列表的状态
    this.setData({
      listArray: listArray
    });
   //动作2：更新日历
    console.log(listArray)
    if (listArray.length==0) {
      console.log("执行了")
      this.calendar.deleteTodoLabels(
        [{
        year: that.data.selectedyear,
        month: that.data.selectedmonth,
        day: that.data.selectedday,
        }]
      );
    }
    //动作3：更新云服务器、
    let date_string = this.data.date_string;
    let obj2 = {}
    obj2[date_string] = listArray;
    db.collection("todos").doc("b6e3a09f-65d6-4672-9840-3c6d914a5d66").update({
      data: obj2,
      success: function (res) {
        console.log("更新成功", res)
      }
    })
   

  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var listArray = this.data.listArray;
      if (index >= 0) {
         listArray[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          listArray: listArray
        });
      }
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var listArray = this.data.listArray;
      console.log(e);
      if (index >= 0) {
        listArray[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          listArray: listArray
        });
      }
    }
  },
  //获取元素自适应后的实际宽度方法
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },

  
// 日期转字符串方法
  dateint2String:function(year,month,day){
    if (month>=10)
      month = month.toString();
    else
      month= '0' + month.toString();
    if (day >= 10)
      day = day.toString();
    else
      day = '0' + day.toString();
    
    let date_string = year.toString() + month + day
    return date_string
  },

  datestring2int:function(str){
    let year = str[0] + str[1] + str[2] + str[3];
   
    year=parseInt(year);
    let month = str[4] + str[5];
    month=parseInt(month);
    let day = str[6] + str[7];
    day = parseInt(day);
    let date_information = [year, month, day];
    return date_information;
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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