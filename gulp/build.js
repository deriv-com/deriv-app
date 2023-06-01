const gulp = require('gulp');
const connect = require('gulp-connect');
const mustache = require('gulp-mustache');
require('./static');
require('./webpack');

const genHtml = () => {
    const { NODE_ENV = 'development' } = process.env || {};
    return gulp
        .src('templates/*.mustache')
        .pipe(mustache({}, { extension: '.html' }, NODE_ENV === 'production' ? '.min' : ''))
        .pipe(gulp.dest('./www'))
        .pipe(connect.reload());
};

gulp.task(
    'build-dev-html',
    gulp.series(done => {
        genHtml();
        done();
    })
);

gulp.task(
    'build-dev-js',
    gulp.series('webpack-dev', done => {
        genHtml();
        done();
    })
);

gulp.task(
    'build-dev-static',
    gulp.series('static', done => {
        genHtml();
        done();
    })
);

gulp.task(
    'build-min',
    gulp.series('static', 'webpack-prod', 'pull-blockly-translations', done => {
        genHtml();
        done();
    })
);

gulp.task('build', gulp.parallel('build-dev-js', 'build-dev-static', 'pull-blockly-translations'));
