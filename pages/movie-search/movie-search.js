// pages/movie-search/movie-search.js
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchResult:{},
    isData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  formSubmit: function(e){
    this.setData({
      isData: false
    })
    if (e.detail.value.input){
      util.getData(app.globalData.httpUrl + '/v2/movie/search?q=' + e.detail.value.input, this.getResult);
    }else{
      wx.showToast({
        icon: 'none',
        title: '请填写关键词',
        duration: 2000
      })
    }
    
    
  },

  getResult: function (movies){
    if(movies.total == 0){
      this.setData({
        isData : true
      })
    }else{
      this.setData({
        isData: false
      })
    }
    var subjectsArr = [];
    for (var idx in movies.subjects) {
      var subject = movies.subjects[idx];

      var subjects = {
        id: subject.id,
        title: subject.title,
        average: subject.rating.average,
        name: util.resetCasts(subject.casts),
        time: subject.year,
        image: subject.images.large,
        genres: subject.genres.join()
      };
      subjectsArr.push(subjects)
    }

     this.setData({
       searchResult: {
         movieList: subjectsArr
       }
     })

     wx.hideLoading();
  },
  movieDetail: function (option) {
    console.log(option)
    var movieid = option.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieId=' + movieid,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})