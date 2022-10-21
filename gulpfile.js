const gulp = require('gulp');
const server = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const fileinclude = require('gulp-file-include');
const babel = require('gulp-babel');
const svgStore = require('gulp-svgstore');
const replace = require('gulp-replace');
const del = require('del');

// const svgList = require('./src/svg-list/index');

// const { STYLE_LIBS, JS_LIBS } = require('./gulp.config');

gulp.task('server', function () {
    server.init({
        server: {
            baseDir: "dist"
        },
        notify: false,
        open: true,
        cors: true,
        ui: false,
    });

    gulp.watch('src/**/*.html', { usePolling: true }, gulp.series('html', refresh));
    gulp.watch('src/sass/**/*.{scss,sass}', { usePolling: true }, gulp.series('styles-main'));
    gulp.watch('src/js/**/*.{js,json}', { usePolling: true }, gulp.series('scripts-main', refresh));
    gulp.watch('src/images/**/*.svg', { usePolling: true }, gulp.series('icons', 'html', refresh));
    gulp.watch('src/images/**/*.{png,jpg}', { usePolling: true }, gulp.series('images', 'html', refresh));
});

const refresh = (done) => {
    server.reload();
    done();
};

// gulp.task('styles-vendor', function() {
//     return gulp.src([...STYLE_LIBS])
//         .pipe(cleanCSS({ compatibility: '*' }))
//         .pipe(concat("vendor.min.css"))
//         .pipe(gulp.dest("dist/css"))
//         .pipe(server.stream());
// });

gulp.task('styles-main', function () {
    return gulp.src("src/sass/**/*.{scss,sass}")
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(autoprefixer({
            grid: true,
        }))
        .pipe(cleanCSS({
            compatibility: '*',
            level: {
                1: {
                    all: true,
                    normalizeUrls: false
                },
                2: {
                    restructureRules: true
                }
            },
        }))
        .pipe(gulp.dest("dist/css"))
        .pipe(server.stream());
});

gulp.task('html', function () {
    return gulp.src(["src/html/*.html", "src/html/pages/**/*.html"])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@root',
            context: { // глобальные переменные для include
                test: 'text'
            }
        }))
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest("dist/"));
});

// Спрайт
gulp.task('sprite', function () {
    return gulp.src('src/images/icons/icons-sprite/**/*.svg')
        .pipe(svgStore({ inlineSvg: true }))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('dist/images/icons'));
});

gulp.task('scripts-main', function () {
    return gulp.src(["src/js/**/*.js"])
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        // .pipe(concat('script.js'))
        // .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest("dist/js"));
});

// gulp.task('scripts-vendor', function() {
//     return gulp.src([...JS_LIBS])
//         // .pipe(uglify())
//         .pipe(concat('vendor.min.js'))
//         .pipe(gulp.dest("dist/js"));
// });

gulp.task('fonts', function () {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task('icons', function () {
    return gulp.src("src/images/icons/**/*.svg")
        .pipe(gulp.dest("dist/images/icons"));
});

gulp.task('images', function () {
    return gulp.src("src/images/img/**/*.{png,jpg,svg}")
        .pipe(gulp.dest("dist/images/img"));
});

// gulp.task('svg-list-styles', function() {
//     return gulp.src("src/svg-list/scss/main.scss")
//         .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
//         .pipe(autoprefixer({ grid: true }))
//         .pipe(cleanCSS({ compatibility: '*' }))
//         .pipe(rename({ basename: 'svg-list', suffix: '.min' }))
//         .pipe(gulp.dest("dist/css"))
// });

// gulp.task('svg-list-scripts', function() {
//     return gulp.src(["src/svg-list/js/main.js"])
//         .pipe(babel({ presets: ['@babel/preset-env'] }))
//         .pipe(uglify())
//         .pipe(rename({ basename: 'svg-list', suffix: '.min' }))
//         .pipe(gulp.dest("dist/js"));
// });

// gulp.task('svg-list-html', function() {
//     const list = svgList(__dirname + '/src/media', '../media');

//     return gulp.src("src/svg-list/index.html")
//         .pipe(replace('{{ replaceiconList }}', list))
//         .pipe(htmlmin({ collapseWhitespace: true }))
//         .pipe(rename({ basename: 'svg-list' }))
//         .pipe(gulp.dest("dist/"));
// });

// gulp.task('svg-list',
//     gulp.series(
//         'svg-list-styles',
//         'svg-list-scripts',
//         'svg-list-html'
//     )
// );

gulp.task('copy',
    gulp.series(
        'fonts',
        'images',
        'icons'
    )
);

gulp.task('clean', () => {
    return del('dist');
});

gulp.task('default',
    gulp.series(
        'clean',
        'styles-main',
        // 'styles-vendor',
        'scripts-main',
        // 'scripts-vendor',
        'sprite',
        'copy',
        'html',
        // 'svg-list',
        'server'
    )
);

gulp.task('build',
    gulp.series(
        'styles-main',
        // 'styles-vendor',
        'scripts-main',
        // 'scripts-vendor',
        'sprite',
        'copy',
        'html',
    )
);