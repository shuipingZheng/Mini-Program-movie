//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    httpUrl: "https://douban.uieee.com",
    selectedCity: '北京'
  },
  requestLocation: function (obj, locationString, isStorage) { //isStorage  是否将地址本地存储
    wx.request({
      url: 'http://apis.map.qq.com/ws/geocoder/v1/?l&get_poi=1',
      data: {
        "key": "XCWBZ-KHRWG-M6LQV-IBOWL-EURS6-UMFDF",
        "location": locationString
      },
      method: 'GET',
      // header: {}, 
      success: function (res) {
        // success
        console.log("请求成功");
        var city = res.data.result.ad_info.city.replace("市", "");

        if (isStorage){
          wx.setStorageSync('locationCity', city)
        }
        
        obj.setData({
          city: city
        })


      },
      fail: function () {
        // fail
        console.log("请求失败");
      },
      complete: function () {
        // complete
        console.log("请求完成");
      }
    })
  }
})