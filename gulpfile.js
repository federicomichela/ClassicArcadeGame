const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require('browser-sync').create();
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const eslint = require("gulp-eslint");

/**
 * Task to compile sass to css
 */
const compileStyle = done => {
    gulp.src("sass/**/*.scss")
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(autoprefixer({"overrideBrowserslist": ["last 2 versions"]}))
        .pipe(gulp.dest("./css"))
        .pipe(browserSync.stream());

    done();
};

/**
 * Convert ES6 ode in all js files in src/js folder and copy to
 * build folder as bundle.js
 */
const build = done => {
    browserify({
        "debug": true,
        "entries": ["./js/main.js"]
    }).transform(babelify.configure({"presets": ["@babel/preset-env"]}))
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(gulp.dest("./build"));

    done();
};

const lint = done => {
    gulp.src(['js/**/*.js'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint({
            "parserOptions": {
                "ecmaVersion": 2018,
                "sourceType": "module"
            }
        }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
        .pipe(eslint.failOnError());

    done();
};

const browserSyncTask = done => {
    browserSync.init({"server": "."});
    done();
};

const watcher = done => {
    gulp.watch("sass/**/*.scss", compileStyle);
    gulp.watch("js/**/*.js", build);

    done();
};

gulp.task("compileStyle", compileStyle);
gulp.task("lint", lint);
gulp.task("build", build);
gulp.task("watch", gulp.series(watcher, browserSyncTask));
gulp.task("default", gulp.parallel(compileStyle, lint, build));

// gulp.task("default", ["styles", "build", "lint"], function() {
//     gulp.watch("sass/**/*.scss", ["styles"]);
//     gulp.watch("js/**/*.js", ["lint"]);
//     gulp.watch("js/**/*.js", ["build"]);
//
//     browserSync.init({"server": "."});
// });
