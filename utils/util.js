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

//请求数据
const getData = (url, callback, tabType) =>{
  wx.showLoading({
    title: '数据加载中',
  });
  wx.request({
    url: url,
    method: 'GET',
    header:{
      "Content-type": "application/text"
    },
    success: res =>{
      callback(res.data, tabType);
    }
  })

}

// 转换主演名
const resetCasts = (casts) =>{
  if (casts.length){
    var castsArr = [];
    for (var i in casts){
      castsArr.push(casts[i].name)   
    }
    // var title = castsArr.join();
    // if (title.length >= 16) {
    //   title = title.substring(0, 16) + "...";
    // }
    return castsArr.join();
  }else{
    return '-';
  }

}

  
  const requestLocation = (obj, locationString, isStorage, callback) => { //isStorage  是否将地址本地存储
    
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?l&get_poi=1',
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

        if (isStorage) {
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

module.exports = {
  getData : getData,
  resetCasts: resetCasts,
  requestLocation: requestLocation
}
