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
import es6 from 'gulp-babel';
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

// es6 编译
gulp.task('es6', ()=> {
  return gulp.src(['./es6/*.js'])
            .pipe(es6({presets: ['es2015']}))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./public/js'))
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
    port: 9799
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

// gulp go
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
];

gulp.watch(['./less/*.*'], ['less']);
gulp.watch(['./es6/*.*'], ['es6']);
gulp.watch(path, ()=> {
  reload();
});

// 构建压缩项目
gulp.task('go', [ 'clean', 'minifycss', 'minifyjs', 'miniimage', 'fonts' , 'nunjucks']);

// 默认执行gulp 启动项目
gulp.task('default', ['browser-sync', 'less', 'es6']);
