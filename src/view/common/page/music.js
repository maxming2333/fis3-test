var $audio = $('<audio style="display: none" autoplay preload loop></audio>');

$('.wrap > a.btn-music').on('tap', function (){
  if($(this).data('audio-type') == "pause"){
    $audio[0].play();
    $(this).addClass('btn-music-anm');
    $(this).data('audio-type', 'play');
  }else{
    $audio[0].pause();
    $(this).removeClass('btn-music-anm');
    $(this).data('audio-type', 'pause');
  }
});

exports.start = function () {
  if(!$audio.data('append')){
    $audio.attr('src', $('.wrap > a.btn-music').data('src'));
    $audio.appendTo($('body'));
    $audio.data('append', true);
  }
  $audio.length > 0 && $audio[0].play();
};