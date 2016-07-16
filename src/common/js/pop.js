/**
 * @Author : maxming
 * @Date   : 16/7/2
 */

'use strict';

$('.pop .pop-close, .pop .pop-back').click(function (){
  $(this).closest('.pop').removeClass('pop-show').addClass('pop-hide');
});

exports.open = function (_class){
  var $em = _class;
  if(typeof _class == 'string'){
    $em = $(_class);
  }

  if($em instanceof Object && $em.hasClass('pop')){
    return $em.removeClass('pop-hide').addClass('pop-show');
  }

  return false;
};