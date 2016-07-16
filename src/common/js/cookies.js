exports.setCookie = function (name, value) {
  var Days = 3 * 30; // 3个月
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString();
};

exports.getCookie = function (name) {
  var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  if (arr != null) return decodeURIComponent(arr[2]);
  return null;
};

exports.delCookie = function (name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT";
};