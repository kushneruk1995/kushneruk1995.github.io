var gulp = require('gulp'), 
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'), 
    concat = require('gulp-concat'), 
    imagemin = require('gulp-imagemin'), 
    csso = require('gulp-csso'), 
    sass = require('gulp-sass'); 
    spritesmith = require('gulp.spritesmith'); 
    watch = require('gulp-watch'); 

gulp.task('sass', function () { 
  gulp.src('src/scss/core.scss') 
    .pipe(sass().on('error', sass.logError)) 
    .pipe(csso()) 
    .pipe(rename("style.main.min.css"))
    .pipe(gulp.dest('dist/css/')); 
});

gulp.task('sprite', function() {
    var spriteData = 
        gulp.src('src/img/sprite/*.png') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
            }));

    spriteData.img.pipe(gulp.dest('src/img/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('src/css/')); // путь, куда сохраняем стили
});
 
gulp.task('images', function() {
    gulp.src('src/img/*') 
        .pipe(imagemin()) 
        .pipe(gulp.dest('dist/img')) 
 
});

gulp.task('default', ['sass', 'sprite','images']);
