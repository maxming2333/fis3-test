var title = $('meta[name=x-share-title]').attr('content');
var content = $('meta[name=x-share-content]').attr('content');
var img = $('meta[name=x-share-images]').data('img');
var url = self.location.href.split('#')[0];

var fun = function () {

  exports.ready && exports.ready();

  var shareData = {
    title: title,
    desc: content,
    link: url,
    imgUrl: img
  };

  // 分享给朋友事件绑定
  wx.onMenuShareAppMessage(shareData);

  // 分享到朋友圈
  wx.onMenuShareTimeline(shareData);

  // 分享到QQ
  wx.onMenuShareQQ(shareData);

  // 分享到QZone
  wx.onMenuShareQZone(shareData);

  // 分享到微博
  wx.onMenuShareWeibo(shareData);

};

$.ajax({
  type: 'get',
  url: 'http://jinglecamps.com/activity/summer-camp/php/wx/signature.php',
  dataType: 'json',
  data: {
    url: self.location.href.split('#')[0]
  },
  success: function (_data) {
    _data.debug = false;
    _data.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'];
    wx.config(_data);
    wx.ready(fun);
  }
});