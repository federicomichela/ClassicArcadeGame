const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require('browser-sync').create();
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");

gulp.task("default", ["styles"], function() {
    "use strict";

    gulp.watch("sass/**/*.scss", ["styles"]);
    gulp.watch("js/**/*.js", ["build"]);

    browserSync.init({"server": "."});
});

gulp.task("styles", function() {
    "use strict";

    gulp.src("sass/**/*.scss")
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(autoprefixer({"overrideBrowserslist": ["last 2 versions"]}))
        .pipe(gulp.dest("./css"))
        .pipe(browserSync.stream());
});

/**
 * Convert ES6 ode in all js files in src/js folder and copy to
 * build folder as bundle.js
 */
gulp.task("build", function(){
    "use strict";

    return browserify({
        "debug": true,
        "entries": ["./js/main.js"]
    })
    .transform(babelify.configure({"presets": ["es2015"]}))
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./build"));
});
