var gulp           = require('gulp'), // Подключение Gulp
		gutil          = require('gulp-util' ), // Подключение пакета gulp-util (полезных функций для gulp плагинов)
		browserSync    = require('browser-sync'), // Подключение Browser Sync
		concat         = require('gulp-concat'), // Подключение gulp-concat (для конкатенации файлов)
		uglify         = require('gulp-uglify'), // Подключение gulp-ugligy (для сжатия JS)
		cleanCSS       = require('gulp-clean-css'), // Подключение пакета для минификации CSS
		rename         = require('gulp-rename'), // Подключение библиотеки для переименования файлов
		del            = require('del'), // Подключение библиотеки для удаления файлов и папок
		imagemin       = require('gulp-imagemin'), // Подключение библиотеки для работы с изображениями
		pngquant       = require('imagemin-pngquant'), // Подключение библиотеки для работы с png
		cache          = require('gulp-cache'), // Подключение библиотеки кеширования
		autoprefixer   = require('gulp-autoprefixer'), // Подключение библиотеки для автоматического добавления префиксов
		notify         = require("gulp-notify");
		
gulp.task('browser-sync', function() { // Таск browser-sync
	browserSync({ // Выполняется browserSync
		server: { // Определение параметров сервера
			baseDir: 'src' // Директория для сервера - src
		},
		notify: false // Отключение уведомлений
	});
});	

gulp.task('styles', function() { // Таск styles
	return gulp.src('src/css source/*.css') // Берётся источник
		.pipe(rename({suffix: '.min', prefix : ''})) // Добавление суффикса .min к именам CSS файлов
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 9'])) // Создание префиксов
		.pipe(cleanCSS()) // Минификация CSS файлов
		.pipe(gulp.dest('src/css/')) // Выгрузка результата в папку src/css
		.pipe(browserSync.reload({stream: true})) // Обновление CSS на странице при изменении
});	

// Таск для минификации JS файла
gulp.task('scripts', function() {
	return gulp.src([
		'src/js/main.js'
		])
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['styles', 'scripts', 'browser-sync'], function() {
	gulp.watch('src/css source/*.css', ['styles']); // Наблюдение за css файлами в папке sass
	gulp.watch('src/js/**/*.js', ['scripts']); // Наблюдение за JS файлами в папке js
	gulp.watch('src/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
});

gulp.task('imagemin', function() {
	return gulp.src('src/img/**/*') // Берутся все изображения из src/img
		.pipe(cache(imagemin({ // Сжатие изображений с наилучшими настройками с учётом кэширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); 
});

gulp.task('removedist', function() {
	return del.sync('dist'); // Удаление папки dist перед сборкой
});

gulp.task('build', ['removedist', 'imagemin', 'styles', 'scripts'], function() {

	var buildCss = gulp.src([ // Перенос CSS файлов в продакшен
		'src/css/fonts.min.css',
		'src/css/main.min.css',
		'src/css/media.min.css'
		]).pipe(gulp.dest('dist/css'));

	var buildFiles = gulp.src([ // Перенос файла с правилами для кэширования файлов на сервере .htaccess в продакшен
		'src/.htaccess'
	]).pipe(gulp.dest('dist'));

	var buildFonts = gulp.src('src/fonts/**/*') // Перенос шрифтов в продакшен
	.pipe(gulp.dest('dist/fonts'));

	var buildLibs = gulp.src('src/libs/**/*') // Перенос библиотек в продакшен
	.pipe(gulp.dest('dist/libs'));

	var buildJs = gulp.src('src/js/main.min.js') // Перенос скриптов в продакшен
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('src/*.html') // Перенос HTML файлов в продакшен
	.pipe(gulp.dest('dist'));

});

gulp.task('clearcache', function () { // Таск очистки кэша
	return cache.clearAll();
});

gulp.task('default', ['watch']); // Таск по умолчанию