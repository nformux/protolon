"use strict";
if ( typeof require === "undefined" ) { var require = {}; }

var gulp = require("gulp");
var harp = require("harp");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var gutil = require( "gulp-util" );
var ftp = require( "vinyl-ftp" );
var cp = require( "child_process" );

gulp.task('serve', function () {
  harp.server(__dirname, {
    port: 9000
  }, function () {
    browserSync({
      proxy: "localhost:9000",
      open: false,
      /* Hide the notification. It gets annoying */
      notify: {
        styles: ['opacity: 0', 'position: absolute']
      }
    });
    /**
     * Watch for scss changes, tell BrowserSync to refresh main.css
     */
    gulp.watch(["public/**/*.css", "public/**/*.sass", "public/**/*.scss", "public/**/*.less"], function () {
      reload("css/main.css", {stream: true});
    });
    /**
     * Watch for all other changes, reload the whole page
     */
    gulp.watch(["public/**/*.html", "public/**/*.ejs", "public/**/*.jade", "public/**/*.js", "public/**/*.json", "public/**/*.md"], function () {
      reload();
    });
  });
});

gulp.task('build', function (done) {
  cp.exec('harp compile .', {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('ftp', ['build'], function(){

  var conn = ftp.create( {
    host: "Put a host here",
    user: "Pust a username here",
    password: "Put a password here"
  });

  var globs = ["www/css/**", "www/fonts/**", "www/img/**", "www/js/**", "www/*.html"];

  return gulp.src( globs, {base: "www/", buffer: false} )
    .pipe( conn.newer("Put a destination folder here"))
    .pipe( conn.dest("Put a destination folder here"));
});

gulp.task("default", function() {
	gulp.start(["serve"]);
});

gulp.task("deploy", ['build','ftp']);
