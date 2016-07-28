module.exports = function (_this){

  var touchStart = {};
  var _ = {};

  _this.on('touchstart', function (event) {
    var event = event || window.event;
    touchStart.Y = event.targetTouches[0].pageY;
  });

  $(document).on('touchmove', function (event) {
    event.preventDefault();
  });

  _this.on('touchend', function (event) {
    var event = event || window.event;
    var offsetY = event.changedTouches[0].pageY - touchStart.Y;
    var pctY = Math.abs(offsetY) / $(this).height();

    // 比较偏移比
    if(pctY > 0.15){
      _.moveEnd && _.moveEnd(event, offsetY);
    }
  });
  
  return _;

};