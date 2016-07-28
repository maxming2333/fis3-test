const fis = require('fis3');
const crypto = require('crypto');
const readlineSync = require('readline-sync');

fis.set('project.files', ['/src/**']);
fis.set('project.charset', 'utf8');
fis.set('project.ignore', ['node_modules/**', 'output/**', 'output.zip', '.git/**', 'fis-conf.js', '.svn/**', 'dist/**', 'release/**', 'README.md', 'local/**', '.idea/**', ".DS_Store", "/.**", "package.json"]);


// Global start

fis.hook('relative');
fis.hook('commonjs');

fis.match('**', {
  relative: true
});

fis.match('/src/**.js', {
  useSameNameRequire: true
});

fis.match('/src/(**.js)', {
  id: '$1',
  isMod: true
});

fis.match('/src/plugin/(**.js)', {
  isMod: false
});

fis.match('/src/common/js/lib/**', {
  isMod: false
});

fis.match('_*.{css,sass,scss,less}', {
  release: false
}, true);

fis.match('**.{css,sass,scss,less}', {
  isCssLike: true,
  useSprite: true,
  optimizer: fis.plugin('clean-css'),
  extras: {
    useUnicode: true
  }
});

fis.match('**.js', {
  isJsLike: true,
  optimizer: fis.plugin('uglify-js'),
  extras: {
    useUnicode: true
  }
});

fis.match('**.png', {
  optimizer: fis.plugin('png-compressor')
});

fis.match('**.{sass,scss}', {
  rExt: '.css',
  parser: fis.plugin('node-sass')
});

var _release = function (media, url){

  return media.match('/src/(**)', {
    release: '/$1',
    url: !url ? null : url+'/$1'
  })
  .match('/pkg/src/(**)', {
    release: '/pkg/$1',
    url: !url ? null : url+'/pkg/$1'
  })
  .match(/^\/src\/(.*(?!(\.html$)))/i, {
    release: '/public/$1',
    url: !url ? null : url+'/public/$1'
  })
  .match('/src/view/(**.html)', {
    release: '/html/$1',
    url: !url ? null : url+'/html/$1'
  });

};

fis.match('::package', {
  spriter: fis.plugin('csssprites-group', {
    margin: 10,
    to: './images'
  }),
  prepackager: fis.plugin('replace-attr', {
    attr : ['data-img', 'data-img-default', 'data-path', 'data-file', 'data-video', 'data-url', 'data-src']
  }, 'append'),
  postpackager: fis.plugin('loader', {
    allInOne: {
      includeAsyncs: true,
      ignore: ['/src/**/mod.js']
    }
  })
});

// Global end

// default media is `dev`
_release(fis.media('dev'))
    .match('**', {
      relative: true,
      useHash: false,
      optimizer: null
    });

_release(fis.media('jg'), '/activity/summer-camp')
    .match('**', {
      useHash: false,
      relative: false,
      // optimizer: null,
      domain: 'http://jinglecamps.com'
    });

fis.media('vps')
    .match('**', {
      relative: false,
      useHash: false,
      domain: 'http://maxtt.cc',
      deploy: [
        function (options, modified, total, next) {
          var token = readlineSync.question('\r\n请输入授权token : ', {
            hideEchoBack: true
          });
          if (!token) {
            return false;
          }
          var md5 = crypto.createHash('md5');
          fis.set('project.token', md5.update(token).digest('hex'));
          console.log('\r\n');
          modified.forEach(function (file) {
            if (file.isHtmlLike) {
              console.log(file.getUrl());
            }
          });
          console.log('\r\n');
          next();
        },
        function () {
          arguments[0] = {
            //如果配置了receiver，fis会把文件逐个post到接收端上
            receiver: 'http://maxtt.cc/receiver.php?debug=false',
            // receiver: 'http://127.0.0.1/receiver.php',
            //这个参数会跟随post请求一起发送
            to: '/home/maxming/www/wb',
            // to: '/Users/maxming/www/wb',
            // 附加参数, 后端通过 $_POST['xx'] 获取
            data: {
              token: fis.get('project.token')
            }
          };
          require('fis3-deploy-http-push-plus').apply(this, arguments);
        }
      ]
    })
    .match('/src/view/(**.html)', {
      url: '/wb/html/$1'
    })
    .match('/src/(**.js)', {
      url: '/wb/public/js/$1'
    })
    .match('/src/(**.{css,sass,scss,less})', {
      url: '/wb/public/css/$1'
    })
    .match('/src/(**.{png,jpg,gif,svg,bmp,ico,swf,jpeg,webp})', {
      url: '/wb/public/images/$1'
    })
    .match('/pkg/src/(**.{css,sass,scss,less})', {
      url: '/wb/public/css/pkg/$1'
    })
    .match('/pkg/src/(**.js)', {
      url: '/wb/public/js/pkg/$1'
    });