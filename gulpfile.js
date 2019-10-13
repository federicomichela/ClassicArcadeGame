const gulp = require("gulp");
const sass = require("gulp-sass");

gulp.task("default", function() {
  // code for your default task goes here
  console.log(">>> HI THERE!");
});

gulp.task("styles", function() {
    gulp.src("sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./css"));
});
