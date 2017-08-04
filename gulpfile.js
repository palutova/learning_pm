/*
 * add all module to gitignore, To install module use console:
 * $ npm install  gulp gulp-if-else gulp-file-include gulp-coffee coffeeify vinyl-source-stream browserify browserify-shim event-stream  gulp-sass gulp-livereload gulp-myth gulp-autoprefixer gulp-csso gulp-uglify  gulp-concat connect st --save-dev
*/
/*
 * end start task watch, to see the result on http://localhost:8080/
 * $ gulp watch
*/
var gulp = require('gulp'), // Сообственно Gulp JS
    ifElse = require('gulp-if-else'),
    fileinclude = require('gulp-file-include'),
    // coffee = require('gulp-coffee'),
    es = require('event-stream'),
    browserify = require('browserify'),
    vinyl = require('vinyl-source-stream'),
    //sass = require('gulp-ruby-sass'), // пробовала не сработал плагин, не скомпилил мои import почему-то
    sass = require('gulp-sass'), // Плагин для SCSS
    livereload = require('gulp-livereload'), // Livereload для Gulp
    myth = require('gulp-myth'), // Плагин для Myth - http://www.myth.io/ автопрефиксы и минификация
    autoprefixer = require('gulp-autoprefixer'), //  автопрефиксы
    csso = require('gulp-csso'), // Минификация CSS
    streamify = require('gulp-streamify'), // Минификация JS
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    connect = require('connect'), // Webserver
    http = require('http'), //to start server
    st = require('st'), //to start server
    clean = require('gulp-clean'); // to remove folders end files

var isBuild = false,
    isMobile = false;

var TEMP_LOCALS = {
                    root_path: "/",
                    root_url: "/",
                    original_url: "http://testplus.xyz/",
                    site_name: "test",
                    seo_title: "ТЕСТ",
                    seo_description: "олватовыапло",
                    seo_image: "/images/ico/favicon144.png",
                    seo_keywords: "олрыалорыва",
                    mnav: [
                      { name:"контакты", url:"contacts.html" }
                    ]

                 };
var path = {
  desktop: {
      css:{
            from: './app/stylesheets/desktop/*.scss',
            to: './www/css/',
            build: './build/css/',

            from_vendor: './app/stylesheets/vendor/*.css',
            to_vendor: './www/css/vendor',
            build_vendor: './build/css/vendor',

            watch_from: ['./app/stylesheets/*/*.scss','./app/stylesheets/*/*.css']
        },
        js: {
            watch_from: ['app/javascripts/vendor/*.js','app/javascripts/*/*.js','app/javascripts/*/*.coffee'],
            source: 'app/javascripts/application.js',
            file_name: 'application.js',
            from_vendors: './app/javascripts/vendor/*.js',
            file_name_vendor: 'application_plugins.js',
            to: './www/js',
            build: './build/js'
        },
        html: {
            template: 'app/template/*.html',
            template_point: './app/template/*.html',
            to: './www/',
            build: './build/'
        },
        fonts: {
            from: ['./app/fonts/**/*','./app/fonts/*'],
            to: './www/fonts',
            build: './build/fonts'
        },
        images: {
            from: './app/images/**/*',
            to: './www/images',
            build: './build/images'
        },
        images_content: {
            from: './public/content/images/**/*',
            to: './www/content/images',
            build: './build/content/images'
        },
      root_directory: {
          from: ['./root_directory/*.*','./root_directory/desktop/*.*'],
          to: './www',
          build: './build'
      }
  },
  mobile: {
      css:{
            from: './app/stylesheets/mobile/*.scss',
            to: './www/mobile/css/',
            build: './build/mobile/css/',

            from_vendor: './app/stylesheets/vendor/*.css',
            to_vendor: './www/css/vendor',
            build_vendor: './build/css/vendor',

            watch_from: ['./app/stylesheets/*/*.scss','./app/stylesheets/*/*.css']
        },
        js: {
            watch_from: ['app/javascripts/vendor/*.js','app/javascripts/*/*.js','app/javascripts/*/*.coffee'],
            source: 'app/javascripts/application_mobile.js',
            file_name: 'application_mobile.js',
            from_vendors: './app/javascripts/vendor/*.js',
            file_name_vendor: 'application_plugins.js',
            to: './www/mobile/js',
            build: './build/mobile/js'
        },
        html: {
            template: 'app/template_mobile/*.html',
            template_point: './app/template_mobile/*.html',
            to: './www/mobile/',
            build: './build/mobile/'
        },
        fonts: {
            from: ['./app/fonts/**/*','./app/fonts/*'],
            to: './www/mobile/fonts',
            build: './build/mobile/fonts'
        },
        images: {
            from: './app/images/**/*',
            to: './www/mobile/images',
            build: './build/mobile/images'
        },
        images_content: {
            from: './public/content/images/**/*',
            to: './www/mobile/content/images',
            build: './build/mobile/content/images'
        },
        root_directory: {
            from: ['./root_directory/*.*','./root_directory/mobile/*.*'],
            to: './www/mobile',
            build: './build/mobile'
        }
  }

};

// server create
gulp.task('server', function(done) {
   http.createServer(
     st({ path: __dirname + '/www', index: 'index.html', cache: false })
   ).listen(8080, done);
});
// end server create

// SCSS init
gulp.task('sass', function () {
   //gulp.src( ifElse(isBuild, function(){ return path.desktop.css.build + '/*' }, function(){ return path.desktop.css.to + '/*' }), {read: false} )
   //    .pipe(clean());
    var p = isMobile? path.mobile : path.desktop;

    //sass(p.css.from)
    //   .on('error', function (err) {
    //     console.error('Error!', err.message); // Если есть ошибки, выводим и продолжаем
    //   })
    gulp.src(p.css.from)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer()) // добавляем префиксы
        .pipe(ifElse(isBuild,function(){return csso()}) )
        .pipe(gulp.dest( ifElse(isBuild,function(){ return  p.css.build }, function(){ return p.css.to }) )) // записываем css
        .pipe(livereload()); // даем команду на перезагрузку css
});


// copy root files
gulp.task('root_dir', function() {
    var p = isMobile? path.mobile : path.desktop;
    gulp.src(p.root_directory.from)
       .pipe(gulp.dest(ifElse(isBuild, function(){ return p.root_directory.build }, function(){ return p.root_directory.to })));
});
// end copy root files

// copy fonts
gulp.task('css_vendor', function() {
    var p = isMobile? path.mobile : path.desktop;
    gulp.src(p.css.from_vendor)
       .pipe(ifElse(isBuild,function(){return csso()}) )
       .pipe(gulp.dest(ifElse(isBuild, function(){ return p.css.build_vendor }, function(){ return p.css.to_vendor })));
});
// end copy fonts

// SCSS init end

//js init
gulp.task('browserify', function() {
    var p = isMobile? path.mobile : path.desktop;
   gulp.src( ifElse(isBuild, function(){ return p.js.build  + '/*' }, function(){ return p.js.to + '/*' }) ).pipe(clean());
   var b = browserify({
       entries: [p.js.source],
       read: false,
       extensions: ['.coffee'],
       exclude: [p.js.from_vendors]
   });
   b.bundle()
   // Передаем имя файла, который получим на выходе, vinyl-source-stream
   .pipe(vinyl(p.js.file_name))
   .pipe(ifElse(isBuild,function(){return streamify(uglify())}))
   .pipe(gulp.dest(  ifElse(isBuild,function(){ return  p.js.build }, function(){ return p.js.to })  ));
});
//end js init


// init html
gulp.task('html', function(){
   var p = isMobile? path.mobile : path.desktop;
   gulp.src( ifElse(isBuild, function(){ return p.html.build  + '/*.html' }, function(){ return p.html.to + '/*.html' }) ).pipe(clean());
   gulp.src(p.html.template_point)

   .pipe(fileinclude({
     prefix: '@@',
     basepath: '@file',
     indent: true
   }))
   .pipe(gulp.dest( ifElse(isBuild, function(){ return p.html.build }, function(){ return p.html.to}) ));
});
//end init html

// copy images
gulp.task('images', function() {
    var p = isMobile? path.mobile : path.desktop;
    gulp.src( ifElse(isBuild, function(){ return p.images.build  + '/*'}, function(){ return p.images.to + '/*' }) ).pipe(clean());
    gulp.src(p.images.from)
        .pipe(gulp.dest( ifElse(isBuild, function(){ return p.images.build }, function(){ return p.images.to}) ));
});
gulp.task('images_content', function() {
    var p = isMobile? path.mobile : path.desktop;
    gulp.src( ifElse(isBuild, function(){ return p.images_content.build  + '/*' }, function(){ return p.images_content.to + '/*' }) ).pipe(clean());
    gulp.src(p.images_content.from)
       .pipe(gulp.dest( ifElse(isBuild, function(){ return p.images_content.build }, function(){ return p.images_content.to}) ));
});
// end copy images
// copy fonts
gulp.task('fonts', function() {
   var p = isMobile? path.mobile : path.desktop;
   gulp.src( ifElse(isBuild, function(){ return p.fonts.build + '/*' }, function(){ return p.fonts.to + '/*'}) ).pipe(clean());
   gulp.src(p.fonts.from)
       .pipe(gulp.dest(  ifElse(isBuild, function(){ return p.fonts.build }, function(){ return p.fonts.to}) ));
});
// end copy fonts

// start server gulp watch on port 8080
gulp.task('watch', ['server'], function() {

   isBuild = false;

   isMobile = false;
   gulp.run('watch_helper');

   isMobile = true;
   gulp.run('watch_helper');

});

gulp.task('watch_helper', function() {
     var p = isMobile? path.mobile : path.desktop;
     // prefabrication project
     gulp.run('browserify');
     gulp.run('images');
     gulp.run('images_content');
     gulp.run('root_dir');
     gulp.run('fonts');
     gulp.run('sass');
     gulp.run('css_vendor');
     gulp.run('html');

     //start watch changes
     gulp.watch(p.css.watch_from, function() {
         gulp.run('sass');
     });

      gulp.watch(p.html.template, function() {
          gulp.run('html');
      });

     gulp.watch(p.js.watch_from, function() {
          gulp.run('browserify');
     });

     //gulp.watch([p.js.from_vendors], function() {
     //    gulp.run('js');
     //});
     //gulp.watch(p.images.from, function() {
     //    gulp.run('images');
     //});
     //
     //gulp.watch(p.images_content.from, function() {
     //    gulp.run('images_content');
     //});

     //gulp.watch(p.fonts.from, function() {
     //    gulp.run('fonts');
     //});

     //gulp.watch([p.css.from_vendor], function() {
     //    gulp.run('css_vendor');
     //});
});


 //fabrication project

gulp.task('build', function() {
    isMobile = false;
    gulp.run('build_helper');

    isMobile = true;
    gulp.run('build_helper');
});

 gulp.task('build_helper', function() {
     isBuild = true;
     gulp.run('browserify');
     gulp.run('images');
     gulp.run('images_content');
     gulp.run('root_dir');
     gulp.run('fonts');
     gulp.run('sass');
     gulp.run('css_vendor');
     gulp.run('html');
 });
 //end fabrication project

