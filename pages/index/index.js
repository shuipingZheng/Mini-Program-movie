//index.js
const app = getApp();
const util = require("../../utils/util.js")

Page({
  data: {
    in_theaters: {},
    coming_soon: {},
    in_theaters_param:{
      // count: 20,
      total: 0,
      start: 0
    },
    coming_soon_param: {
      // count: 20,
      total: 0,
      start: 0
    },
    current: "in_theaters", //当前tab
    pullDown: false,
    reachBottom: false,
    city: '北京',
    scrollHeight: wx.getSystemInfoSync().windowHeight,
    isReady: false,
    loadMore: false

  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {

    var _this = this; 
    // 本地是否有缓存地址，有则更新city，没有则默认globalData中的city，再去定位，再更新city
    wx.getStorage({
      key: 'locationCity',
      success: function (res) {

        _this.setData({
          city: res.data
        })
        _this.loadData();

      }, fail: function (error){
        _this.loadData();
        _this.getCity();
      }
    })

    setTimeout(function(){
      _this.data.isReady = true;
    },1000)
  },
  // 加载数据
  loadData: function(){
    
    util.getData(app.globalData.httpUrl + "/v2/movie/" + this.data.current + "?city=" + this.data.city + "&start=" + this.data[this.data.current + "_param"].start + "&count=20", this.getResult, this.data.current);
    //this.getMovieData(app.globalData.httpUrl + "/v2/movie/coming_soon" + "?start=0&count=6", "comingSoon", "即将上映");
  },
  //请求回调
  getResult: function (movies, tabType) {
    // 整理json----------------------------------------------
    var subjectsArr = [];
    for (var idx in movies.subjects){
      var subject = movies.subjects[idx];
      var subjects = {
        id: subject.id,
        title: subject.title,
        average: subject.rating.average,
        name: util.resetCasts(subject.casts),
        time: subject.year,
        image: subject.images.large,
        genres : subject.genres.join() 
      };
      subjectsArr.push(subjects)
    }
    // 整理json----------------------------------------------end

    var data = {};

    //判断上拉加载操作---------------------------------
    if (this.data.reachBottom) {
      //拼接新数据
      data[this.data.current] = {
        movieList: this.data[this.data.current].movieList.concat(subjectsArr)
      }
      this.setData({
        reachBottom: false,
        loadMore : false
      })
    }else{ //下拉刷新与初始
      data[tabType] = {
        movieList: subjectsArr
      }
    } 

    
    
    // 更新开始条数
    data[this.data.current+'_param'] ={
      start: movies.start,
      total: movies.total
    }
    
    
    this.setData(data)

    //下拉刷新操作------------------------------
    if(this.data.pullDown){
      this.setData({
        pullDown: false
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    }
     wx.hideLoading();
  },
  //滑动切换
  // swiperTab: function (e) {
  //   console.log(e)
  //   this.setData({
  //     current: e.detail.currentItemId
  //   });
  // },
  // 切换tab
  swiperTab: function (e){
    
    var current = '';
    if(e.type == 'tap'){
      current = e.currentTarget.dataset.current;
    }else{
      current = e.detail.currentItemId;
    }
    

    this.setData({
      current: current
    })
    var arr = Object.keys(this.data[current]);
    if (arr.length == 0 ){
      this.loadData();
    }
  },

  // 详情页
  movieDetail: function (option) {
    var movieid = option.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieId=' + movieid,
    })
  },
  // 搜索页
  onSearch: function(){
    wx.navigateTo({
      url: '../movie-search/movie-search',
    })
  },
  // 城市定位
  citys: function () {

    wx.navigateTo({
      url: '../citys/citys',
    })
  },

  // 下拉刷新
  onPullDownRefresh: function(){
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    // 重置参数
    var data = {};
    data[this.data.current + '_param'] ={
      start: 0,
      total: 0
    }
    data['pullDown'] = true;
    this.setData(data);

    this.loadData();
  },
  //页面上拉加载
  loadMore: function(){

    var total = this.data[this.data.current + '_param'].total;
    var start = this.data[this.data.current + '_param'].start;
    //var count = parseInt(this.data.in_theaters_param.count);
  
    if(start + 20 > total){
      
    }else{
      this.setData({
        loadMore : true
      })

      start = start + 20;
      var data ={};
      data[this.data.current + '_param'] = {
        start: start
      }
      data['reachBottom'] = true;
      this.setData(data);
      this.loadData();

    }

  },
  //   该方法绑定了页面滚动时的事件
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  getCity: function(){


    var _this = this;

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log("定位成功");
        var locationString = res.latitude + "," + res.longitude;

        util.requestLocation(_this, locationString, true);

        var data = {};
        data[_this.data.current + '_param'] = {
          start: 0,
          total: 0
        }
        _this.setData(data)
        _this.loadData();
      },
      fail: function () {
        // fail
        console.log("定位失败");
      },
      complete: function () {
        // complete
        console.log("定位完成");
      }
    })
  },
  onShow: function(){
    if (!this.data.isReady){
      return false;
    }

    var city = this.data.city;
    var location = wx.getStorageSync('locationCity');

    if (city != location && location != ""){
      // 因为切换城市 待映数据并不会更换，所以这里只更新热映数据
        var data = {};
        data['in_theaters_param'] = {
          start: 0,
          total: 0
        };
        data['city'] = location;
        this.setData(data)
      util.getData(app.globalData.httpUrl + "/v2/movie/in_theaters?city=" + this.data.city + "&start=" + this.data["in_theaters_param"].start + "&count=20", this.getResult, 'in_theaters');
     
    }
  },
  // 分享
  onShareAppMessage: function(){
    return {
      title: '最近上映的电影你看了吗？',
      // desc: 'biubiubiubiu',
      path: 'pages/index/index',
      success: function (shareTickets) {
        console.log(shareTickets)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }

})
