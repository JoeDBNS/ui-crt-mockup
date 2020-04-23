var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var gulpCopy = require('gulp-copy');
var terser = require('gulp-terser');

gulp.task('sass', function () {
  return gulp.src('./src/scss/main.scss')
    .pipe(sass.sync().on('error', sass.logError))
    //.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // Option for compressed file
    .pipe(gulp.dest('./static/css'));
});

var sourceFiles = [
	'./node_modules/bootstrap/dist/js/bootstrap.min.js',
  './node_modules/bootstrap/dist/js/bootstrap.min.js.map'
];

gulp.task('copy', function () {
	return gulp.src(sourceFiles)
		.pipe(gulp.dest('./static/js'));
});

var globalScripts = [
  './src/js/variables.js',
  './src/js/imports.js',
  './src/js/components/imask.js',
  './src/js/components/referrerCheck.js',
  './src/js/components/formControls.js',
  './src/js/main.js'
];

gulp.task('scripts', function() {
  return gulp.src(globalScripts)
    .pipe(terser())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./static/js'));
});

gulp.task('watch', function() {
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/js/**/*.js', ['scripts']);
});

gulp.task('default', ['sass', 'scripts', 'copy']);
