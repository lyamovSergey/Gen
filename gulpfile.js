var gulp       	 = require('gulp'), 
	sass         = require('gulp-sass'), 
	browserSync  = require('browser-sync'), 
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglifyjs'), 
	cssnano      = require('gulp-cssnano'), 
	rename       = require('gulp-rename'), 
	del          = require('del'),
	cache        = require('gulp-cache'),
	babel		 = require('gulp-babel'),
	minify 		 = require('gulp-minify'),
	autoprefixer = require('gulp-autoprefixer')
	htmlmin      = require('gulp-htmlmin')
	manifest     = require('./manifest.json');



let version = manifest.version;
			
gulp.task('scss', function() { 
	return gulp.src([
		'app/scss/settings.scss', 
		'app/scss/mixins.scss', 
		'app/scss/main.scss']) 
		.pipe(sass()) 
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
		.pipe(concat('main.css')) 
		.pipe(cssnano())
		.pipe(gulp.dest('app/css')) 
		.pipe(browserSync.reload({stream: true})) 
});
gulp.task('css-libs', function() {
	return gulp.src([
		'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css',
		'node_modules/slick-carousel/slick/slick-theme.css',
		'node_modules/slick-carousel/slick/slick.css',
		'node_modules/jquery-form-styler/dist/jquery.formstyler.css',
		'node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css',
		'node_modules/materialize-css/dist/css/materialize.css'
	])
		.pipe(concat('libs.min.css')) 
		.pipe(cssnano()) // Сжимаемs
		.pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('browser-sync', function() { 
	browserSync({ 
		server: { 
			baseDir: 'app' 
		},
		notify: false 
	});
});

gulp.task('libsJS', function() {
	return gulp.src([
			'node_modules/jquery/dist/jquery.js',
			'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
			'node_modules/slick-carousel/slick/slick.js',
			'node_modules/jquery-validation/dist/jquery.validate.js',
			'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
			'node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
			'node_modules/materialize-css/dist/js/materialize.js'
		])
		.pipe(concat('libs.min.js?')) 
		.pipe(babel())
		.pipe(uglify()) //минификация
		.pipe(gulp.dest('app/js')); 
});

gulp.task('mainScript', function() {
	return gulp.src('app/js/main.js')
		.pipe(concat('main.min.js')) 
		.pipe(babel())
		.pipe(uglify()) //минификация
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({stream: true}))
});





gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});


gulp.task('clean', async function() {
	return del.sync('dist'); 
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*') 
		.pipe(gulp.dest('dist/assets/img')); 
});


gulp.task('prebuild', async function() {
	var buildCss = gulp.src([ 'app/css/**/*'])
	// .pipe(rename(function(path){
	// 	path.basename += "_v."+version;
	// }))
	.pipe(gulp.dest('dist/assets/css'))

	var buildFonts = gulp.src('app/fonts/**/*') 
	.pipe(gulp.dest('dist/assets/fonts'))

	var buildJs = gulp.src('app/js/libs.min.js')
	// .pipe(rename(function(path){
	// 	path.basename += "_v."+version;
	// })) 
	.pipe(gulp.dest('dist/assets/js'))


	var scripts = gulp.src('app/js/**/*') 
	.pipe(babel())
	.pipe(uglify()) //минификация
	// .pipe(rename(function(path){
	// 	path.basename += "_v."+version;
	// }))
	.pipe(gulp.dest('dist/assets/js'));

	var buildHtml = gulp.src('app/*.html')
	// .pipe(htmlmin({
	// 	collapseWhitespace: true, // удаляем все переносы
	// 	removeComments: true // удаляем все комментарии
	//   })) 
	.pipe(gulp.dest('dist/assets/'));

	var buildManifest = gulp.src('./manifest.json') 
	.pipe(gulp.dest('dist/assets/'));
	


	var slickFonts = gulp.src([
		'app/fonts/slick.eot',
		'app/fonts/slick.ttf',  
		'app/fonts/slick.woff',  
		'app/fonts/slick.svg' ])
	.pipe(gulp.dest('dist/assets/css/fonts'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('scss')); 
	gulp.watch('app/*.html', gulp.parallel('code')); 
	gulp.watch('app/js/main.js', gulp.parallel('mainScript')); 
});
gulp.task('default', gulp.parallel('css-libs', 'scss', 'libsJS', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'scss', 'libsJS'));