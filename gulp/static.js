const gulp = require('gulp');

gulp.task(
    'static-css',
    gulp.series(() => gulp.src('static/css/*.css*').pipe(gulp.dest('./www/css')))
);

gulp.task(
    'static',
    gulp.series('static-css', () => gulp.src(['static/**', '!static/css/*']).pipe(gulp.dest('./www')))
);
