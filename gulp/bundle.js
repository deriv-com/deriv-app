const gulp = require('gulp');
const del = require('del');
const paths = require('vinyl-paths');
// const rev = require('gulp-rev');
// const through = require('through2');
const concat = require('gulp-concat-util');
// const { addToManifest } = require('./revision');

gulp.task(
    'clean-bundle',
    gulp.parallel(() => gulp.src('./www/js/bundle*').pipe(paths(del)))
);

gulp.task(
    'bundle-js',
    gulp.parallel(done => {
        gulp.src([
            './node_modules/blockly/blockly_compressed.js',
            './node_modules/blockly/blocks_compressed.js',
            './node_modules/blockly/javascript_compressed.js',
            './node_modules/blockly/msg/messages.js',
        ])
            .pipe(concat('bundle.js'))
            .pipe(gulp.dest('www/js/'))
            .on('end', () => done());
    })
);
