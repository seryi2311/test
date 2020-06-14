const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass  = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const autoprefixer = require('gulp-autoprefixer');
gulp.task('server', function() {
    browserSync.init({
        server: {
            port:9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

/*---------------Pug----------*/
gulp.task('template', function buildHTML() {
  return gulp.src('source/template/index.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('build'))
});

/*---------------Style----------*/

gulp.task('sass', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(sass({outputSryle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('build/css'));
});
/*---------------Sprite----------*/
gulp.task('sprite', function (cb) {
  const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));
  cb();
});

/* ----------Delete----------*/
  gulp.task('clean',function del(cb){
    return rimraf('build',cb);
  });

/*----------Copy fonts------------------*/
  gulp.task('copy:fonts',function(){
    return gulp.src('source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
  });

/*----------Copy images------------------*/
  gulp.task('copy:images',function(){
    return gulp.src('source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
  });

/*----------Copy ------------------*/
  gulp.task('copy',gulp.parallel('copy:fonts','copy:images'));

/*----------Watchers ------------------*/

  gulp.task('watch',function(){
    gulp.watch('source/template/**/*.pug', gulp.series('template'));
    gulp.watch('source/styles/**/*.scss', gulp.series('sass'));
  });

  gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('template','sass','sprite','copy'),
    gulp.parallel('watch','server')
  )
);
