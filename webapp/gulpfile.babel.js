import gulp from 'gulp';
import less from 'gulp-less';
import prefix from 'gulp-autoprefixer';
import nodemon from 'gulp-nodemon';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import nunjucks from 'gulp-nunjucks';
import imagemin from 'gulp-imagemin';
import es6 from 'gulp-babel';
import del from 'del';
import config from './config';
import minifycss from 'gulp-minify-css';

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// DONE can not compite less file

gulp.task('less', function() {
  return gulp.src(['./less/*.less'])
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./static/css'))
});

// es6 编译
gulp.task('es6', function() {
  return gulp.src(['./es6/*.js', './es6/*/*.js'])
    .pipe(sourcemaps.init({largeFile: true}))
    .pipe(es6({presets: ['es2015']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./static/js'))
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

gulp.task('minifycss', ['less'],function(){
  return gulp.src('./static/css/**/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('./public/css'))
});

gulp.task('minifyjs', ['es6'],function() {
  return gulp.src('./static/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'))
});

gulp.task('miniimage', ()=> {
  return gulp.src('./public/img/**／*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/public/img'))
});

gulp.task('fonts', ()=> {
  return gulp.src('./public/fonts/*')
    .pipe(gulp.dest('./dist/public/fonts'))
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


gulp.watch('./less/*.*', ['less'], ()=> {
  reload();
});

gulp.watch(['./es6/*.*', './es6/*/*.*'], ['es6'], ()=> {
  reload();
});

gulp.watch(path, ()=> {
  reload();
});

// 构建压缩项目
gulp.task('go', [ 'clean', 'minifycss', 'minifyjs', 'miniimage', 'fonts' , 'nunjucks']);
gulp.task('going', ['less', 'es6'], function(){
});
gulp.task('build', [ 'minifycss', 'minifyjs']);

// 默认执行gulp 启动项目
gulp.task('default', ['browser-sync', 'less', 'es6']);
