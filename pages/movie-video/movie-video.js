// pages/movie-video/movie-video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentVideo:{},
    videoInfo:{},
    currentVideoId : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前播放视频信息
   var c = wx.getStorageSync('currentVideo');
   //获取视频列表
    var v = wx.getStorageSync('videoInfo');
    
   this.setData({
     currentVideo: c,
     videoInfo: v,
     currentVideoId: c.id
   })

    this.setTitle();
  
  },
  // 播放视频
  onplayer: function(e){
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;

    if (id != this.data.currentVideoId){
      //本地存储
      wx.setStorageSync('currentVideo', this.data.videoInfo.videoList[index])
      // 重置数据
      this.setData({
        currentVideo: this.data.videoInfo.videoList[index],
        currentVideoId: this.data.videoInfo.videoList[index].id
      })
      // 更改标题
      this.setTitle();
    }
  },
  // 更改标题
  setTitle: function(){
    wx.setNavigationBarTitle({
      title: this.data.videoInfo.title + ' - ' + this.data.currentVideo.title
    });
  },
  //播放错误提示
  errorTip: function(){
    wx.showToast({
      icon: 'none',
      title: '由于豆瓣权限限制，视频无法播放',
      duration: 2000
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})