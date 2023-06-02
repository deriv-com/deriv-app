const gulp = require('gulp');
const rev = require('gulp-rev');
const through = require('through2');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const { addToManifest } = require('./revision');

const gen = env => {
    process.env.NODE_ENV = env;
    // eslint-disable-next-line global-require
    return webpackStream(require('../webpack.config.web'), webpack).pipe(gulp.dest('www/js'));
};

const addRev = () =>
    gulp
        .src(['./www/js/bot*.js'])
        .pipe(rev())
        .pipe(through.obj(addToManifest))
        .pipe(gulp.dest('www/js'));

gulp.task(
    'webpack-gen-dev',
    gulp.series(done => {
        gen('development');
        done();
    })
);

gulp.task(
    'webpack-gen-prod',
    gulp.series(done => {
        gen('production').on('end', () => done());
    })
);

gulp.task(
    'webpack-dev',
    gulp.series('webpack-gen-dev', done => {
        addRev();
        done();
    })
);

gulp.task(
    'webpack-prod',
    gulp.series('webpack-gen-prod', done => {
        addRev();
        done();
    })
);
