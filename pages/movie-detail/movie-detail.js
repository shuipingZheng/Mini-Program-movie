const app = getApp();
const util = require("../../utils/util.js");

Page({
  data: {
    subject: {},
    photos: [],
    casts: [],
    isUnfold: false, //展开收起
    summaryH: '135rpx'
  },
  onLoad: function(options){
    util.getData(app.globalData.httpUrl + "/v2/movie/subject/" + options.movieId, this.getResult)
    //util.getData(app.globalData.httpUrl + "/v2/movie/subject/27110296", this.getResult)
   // "27110296"
    ///v2/movie / subject /
  },
  //回调结果
  getResult: function(res){
    // 剧照预览链接数组
    var photosArr = [];
    if (res.photos){
      for (var i in res.photos) {
        var p = res.photos[i];
        photosArr.push(p.image);
      }
    }
    // 演职照片预览链接数组
    var castsArr = [];
    if (res.casts) {
      for (var i in res.casts) {
        var c = res.casts[i];
        castsArr.push(c.avatars.large);
      }
    }

    // 视频信息 本地存储
    var videoInfo = {
      title: res.title,
      average: res.rating.average,
      videoList:res.trailers.concat(res.clips),
      pubdates: res.pubdates
    };
    wx.setStorage({
      key: 'videoInfo',
      data: videoInfo
    })

    
    this.setData({
      subject: res,
      photos: photosArr,
      casts: castsArr
    });
    wx.hideLoading();
  },
  //预览图片
  previewImage: function(e){
    
    var imageType = e.target.dataset.type;
    var current = e.target.dataset.src;  //单个图片
    var urls = []; //图片组
    
    if (imageType){ 
      urls = this.data[imageType];
    }else{
      urls = [e.target.dataset.src];
    }
    wx.previewImage({
      current: current,
      urls: urls
    })
  },

  //播放视频
  onplayer: function(e){

    // 当前点击视频信息
    var v = e.currentTarget.dataset.video;
    wx.setStorageSync('currentVideo', v)

    wx.navigateTo({
      url: '../movie-video/movie-video'
    });
  },
  // 分享
  onShareAppMessage: function () {

    return {
      title: this.data.subject.title,
      // desc: 'biubiubiubiu',
      path: 'pages/movie-detail/movie-detail?movieId=' + this.data.subject.id,
      imgUrl: this.data.subject.images.small,
      success: function (shareTickets) {
        console.log(shareTickets)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
  // 展开收起
  unfold: function(){
    
    this.setData({
      isUnfold: !this.data.isUnfold,
      summaryH: this.data.isUnfold ? '135rpx' : 'auto'
    })
  }
})