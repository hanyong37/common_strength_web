import gulp from 'gulp';
import less from 'gulp-less';
import prefix from 'gulp-autoprefixer';
import nodemon from 'gulp-nodemon';
import sourcemaps from 'gulp-sourcemaps';
import cleancss from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import nunjucks from 'gulp-nunjucks';
import imagemin from 'gulp-imagemin';
import del from 'del';
import config from './config';

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// DONE can not compite less file

gulp.task('less', ()=> {
  return gulp.src(['./less/*.less'])
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./public/css'))
            .pipe(reload({stream: true}));
});

//  浏览器同步
//  proxy 服务器代理

gulp.task('browser-sync',['nodemon'] , ()=> {
  browserSync.init({
    proxy: {
      target: 'http://127.0.0.1:' + config.port
    },
    files: ['*'],
    open: false,
    notify: false,
    port: 9798
  });
});

gulp.task('nodemon', (a)=> {
  var ft = false;
  return nodemon({
    script: 'app.js'
  }).on('start', ()=> {
    if (!ft) {
      a();
      ft = true;
    }
  });
});

// 压缩合并 css or js or image

gulp.task('minifycss', ()=> {
  return gulp.src('./public/css/*.css')
            .pipe(gulp.dest('./dist/css'))
            // .pipe(rename({suffix:'.min'}))
            // .pipe(cleancss())
            // .pipe(gulp.dest('./dist/css'));
});

gulp.task('minifyjs', ()=> {
  return gulp.src('./public/js/*.js')
            // .pipe(concat('public.js'))
            .pipe(gulp.dest('./dist/js'))
            // .pipe(rename({suffix:'.min'}))
            // .pipe(uglify())
            // .pipe(gulp.dest('./dist/js'));
});

gulp.task('miniimage', ()=> {
  return gulp.src('./public/images/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./dist/images'))
});

gulp.task('fonts', ()=> {
  return gulp.src('./public/fonts/*')
            .pipe(gulp.dest('./dist/fonts'))
});

// 编译 nunjucks

gulp.task('nunjucks', ()=> {
  return gulp.src(['./views/*.html'])
            .pipe(nunjucks.compile({ name: 'Sindre' }))
            .pipe(gulp.dest('./dist'));
});

// 每次启动，删除 dist

gulp.task('clean', (a)=> {
  del(['./dist'],a);
});

// 修改 less 后生成
var path = [
  './views/*.*',
  './views/*/*.*',
  './public/javascript/*.*'
];

gulp.watch('./less/*.*', ['less']);
gulp.watch(path, ()=> {
  reload();
});
// 默认执行gulp

gulp.task('default', [ 'clean', 'browser-sync', 'less', 'minifycss', 'minifyjs', 'miniimage', 'fonts' , 'nunjucks']);
