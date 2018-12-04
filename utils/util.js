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
const getData = (url, callback) =>{
  wx.showLoading({
    title: '数据加载中',
  });
  wx.request({
    url: url,
    method: 'GET',
    header:{
      "content-type": "application/xml"
    },
    success: res =>{
      callback(res.data);
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

module.exports = {
  getData : getData,
  resetCasts: resetCasts
}
