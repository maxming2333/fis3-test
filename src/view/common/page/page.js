/**
 * @Author : maxming
 * @Date   : 16/7/3
 */

'use strict';

$(function () {

  var TXWX = require('./weixin.js');
  var MUSIC = require('./music.js');
  var TOUCH = require('./touch.js')($('.wp-inner'));
  var COOKIES = require('../../../common/js/cookies');
  var pageIndex = 0;
  var shareIndex = $('.wp-inner > .page-share').index();
  var likeIndex = $('.wp-inner > .page-like').index();
  var joinIndex = $('.wp-inner > .page-join').index();
  var fp = COOKIES.getCookie('finger-print');
  var like = COOKIES.getCookie('user-btn-like');
  var thread;
  var canMove = true;

  MUSIC.start();

  TXWX.ready = function () {
    MUSIC.start();
  };

  // $('.wp-inner').fullpage({
  //   start: 0
  // });
  //
  // new Swiper('.swiper-container', {
  //   loop: true,
  //   slidesPerView: 2,
  //   prevButton: '.banner-box .swiper-button-prev',
  //   nextButton: '.banner-box .swiper-button-next'
  // });

  var setShadeTop = function () {
    var top = $(this).data('shade-top');
    var $shadeTop = $('.wrap > .shade .shade-top');
    if (top == 'black') {
      $shadeTop.addClass('shade-top-black');
    } else {
      $shadeTop.removeClass('shade-top-black');
    }
  };

  var setImgCenter = function () {
    var $img = $(this).children('img');

    if ($img.hasClass('is-center')) {
      return false;
    }

    $img.addClass('is-center');

    // if($(this).height() < $img.height()){
    //   $img.addClass('is-center').css({
    //     'margin-top' : -($img.height() - $(this).height()) / 2
    //   });
    // }
  };

  var beforeMove = function (_index) {
    canMove = false;

    setShadeTop.call(this);
    setImgCenter.call(this);

    // 显示泡泡弹跳效果
    if (_index == shareIndex || _index == likeIndex) {
      (function (_t) {
        $(_t).find('.shade-content').removeClass('anm out-anm');
        setTimeout(function () {
          $(_t).find('.shade-content').addClass('anm');
        }, 200);
      })(this);
    }

    // 如果是朋友哪一个page,就实例化swiper
    if ($(this).hasClass('page-friend') && $(this).find('.swiper-container-horizontal').length == 0) {
      setTimeout(function () {
        new Swiper('.swiper-container', {
          loop: true,
          slidesPerView: 2,
          prevButton: '.banner-box .swiper-button-prev',
          nextButton: '.banner-box .swiper-button-next'
        });
      }, 200);
    }

    // 过 x秒 后才能再次滑动
    setTimeout(function () {
      canMove = true;
    }, 1000);
  };

  var moveToPage = function (_index, _isNext, _call) {
    if (!canMove) {
      return false;
    }

    var $pages = $('.wp-inner > .page');

    // 超出页面范畴就停止
    if (_index < 0 || _index >= $pages.length) {
      return false;
    }

    if($pages.eq(_index).css('display') == "none"){
      if(_isNext){
        _index += 1;
      }else{
        _index -= 1;
      }
      return moveToPage(_index, _isNext, _call);
    }

    beforeMove.call($pages.eq(_index), _index);

    $pages.removeClass('fade-in fade-out move-next move-prev');

    // 如果有视频,就暂停
    (function () {
      var $video = $pages.eq(pageIndex).find('video').eq(0);
      $video.addClass('hide');
      try {
        $video[0].pause();
      } catch (e) {
      }
    })();

    $pages
    .eq(pageIndex)
    .removeClass('fade-in fade-out')
    .css({
      "z-index": 3
    })
    .addClass('fade-out');

    $pages
    .eq(_index)
    .css({
      "z-index": 10,
      "transform": "translateY(0)"
    })
    .addClass('fade-in');

    (function (index) {
      var $thisPage = $pages.eq(index);
      setTimeout(function () {
        $thisPage.css({
          "transform": "translateY(100%)"
        });
        if($thisPage.data('page-type') == "hide"){
          $thisPage.addClass('hide');
        }
      }, 1000);
    })(pageIndex);

    if (_isNext) {
      $pages.eq(pageIndex).addClass('move-next');
      $pages.eq(_index).addClass('move-next');
    } else {
      $pages.eq(pageIndex).addClass('move-prev');
      $pages.eq(_index).addClass('move-prev');
    }

    pageIndex = _index;

    _call && _call.apply($pages.eq(_index), arguments);
  };

  TOUCH.moveEnd = function (event, offset) {

    var next = pageIndex + 1;
    var prev = pageIndex - 1;
    var nextPageIndex = offset < 0 ? next : prev;

    moveToPage(nextPageIndex, offset < 0);
  };

  $('.shade-bottom .btn-next').on('tap', function () {
    moveToPage(pageIndex + 1, true);
  });

  // 调试
  // setTimeout(function (){
  //   moveToPage(16);
  // }, 1000);

  // 圆圈点击关闭
  $('.share-box .btn-close').on('tap', function (event, isClickLikeBtn) {
    var ctx = this;
    $(ctx).closest('.shade-content').removeClass('anm').addClass('out-anm');
    setTimeout(function () {
      if(isClickLikeBtn){
        $('.page.page-share').removeClass('hide');
      }
      moveToPage(pageIndex + 1, true);
    }, 300);
    return false;
  });

  // 视频处理
  (function () {
    var videHtml = '<video class="shade-video hide" data-src="' + ($('.page-cover .shade-video-src').data('url')) + '" controls></video>';
    $('.page-cover .shade').prepend(videHtml);

    $('.page-cover .btn-video').on('tap', function (e) {
      var $video = $(this).closest('.shade').find('.shade-video').removeClass('hide');
      $video.attr('src', $video.data('src'));
      $video[0].play();
      $video.unbind('tap');

      // 点击其他地方隐藏
      $(document).one("tap", function () {
        $video.addClass('hide');
        $video[0].pause();
      });

      e.stopPropagation();

      $video.on('tap', function (event) {
        event.stopPropagation();
      });

    });
  })();

  // 点击"了解菁果"
  $('.page-friend .bottom-info .btn-jg').on('tap', function () {
    moveToPage(joinIndex, true);
  });

  // 点击头部"立即报名"
  // $('.wrap > .shade .shade-top .btn-join, .page-join .shade-content .btn-join').on('tap', function () {
  //   moveToPage(shareIndex, true);
  // });

  // 点击"报名成功"按钮
  $('.page-share .shade-content .btn-join').on('tap', function () {
    moveToPage(0, false);
  });

  // 点赞按钮
  $('.page-like .btn-like').on('tap', function (event, isDisable) {
    if ($(this).hasClass('disable')) {
      return false;
    }
    var ctx = this;
    var $num = $(ctx).siblings('.like-num');
    $(ctx).addClass('disable');
    $num.addClass('disable');
    if (!isDisable) {
      // 点赞完成自动move到下一页
      setTimeout(function () {
        $(ctx).closest('.share-box').find('.btn-close').trigger('tap', [true]);
      }, 400);
      var likeNum = $num.find('span').text();
      $num.find('span').text(Number(likeNum) + 1);
      if (!fp) {
        new Fingerprint2().get(function (result) {
          COOKIES.delCookie('finger-print');
          COOKIES.setCookie('finger-print', result);
          if (like != thread.thread_key) {
            createComments(result);
          }
        });
      } else {
        if (like != thread.thread_key) {
          createComments(fp);
        }
      }
    }else{
      $(ctx).closest('.page').data('page-type', 'hide');
      $('.page.page-share').data('page-type', 'block');
      $(ctx).closest('.share-box').addClass('disable');
    }
  });

  // 获取点赞数
  function getComments() {
    $.ajax({
      type: 'post',
      url: 'http://jinglecamps.com/activity/summer-camp/php/ds.php?use=counts',
      dataType: 'json',
      success: function (data) {
        var likeNum = 0;
        for (var key in data.response) {
          thread = data.response[key];
          likeNum = thread.comments;
          if (like == thread.thread_key) {
            $('.page-like .btn-like').trigger('tap', [true]);
          }else{
            $('.page.page-like').removeClass('hide');
            $('.page.page-share').addClass('hide');
          }
        }
        $('.share-content .like-num span').text(likeNum);
      }
    })
  };

  getComments();

  // 点赞
  function createComments(_id) {
    $.ajax({
      type: 'post',
      url: 'http://jinglecamps.com/activity/summer-camp/php/ds.php?use=create',
      dataType: 'json',
      data: {
        message: '1',
        author_name: _id,
        author_email: _id + '@qq.com',
        access_token: _id
      },
      success: function (data) {
        if (data.code == 0) {
          try {
            COOKIES.delCookie('user-btn-like');
            COOKIES.setCookie('user-btn-like', data.response.thread.thread_key);
          } catch (e) {
          }
        }
      }
    })
  };

});