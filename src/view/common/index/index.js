$(function (){
  "use strict";

  var POP = require('../../../common/js/pop');

  $('.wrap-1 .btn-menu').on('tap', function (){
    var $menu = $(this).siblings('.menu-box');
    if($menu.hasClass('show')){
      $menu.removeClass('show');
      $menu.find('li a').removeClass('show-up');
    }else{
      $menu.addClass('show');
      $menu.find('li a').each(function (index){
        var ctx = this;
        setTimeout(function (){
          $(ctx).addClass('show-up');
        }, index * 100);
      });
    }
    return false;
  });

  $('.btn-more').on('tap', function (){
    POP.open('.pop-section-1');
  });
});