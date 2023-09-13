
const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const cache = require('gulp-cache');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint'); 
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');
const wbBuild = require('workbox-build');

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'build/*', '!build/.git'], {dot: true}));

gulp.task('css', () => {
  gulp.src([
    'node_modules/bootstrap/dist/css/bootstrap.css',
    'app/css/**/*.css'
  ])
    .pipe(cleanCSS())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('js', () => {
  gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/handlebars/dist/handlebars.js',
    'node_modules/mocha/mocha.js',
    'app/js/**/*.js'
  ])
    .pipe(gulp.dest('./build/js'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./build/images'));
});

gulp.task('json', () => {
  gulp.src('app/**/*.json')
    .pipe(htmlmin())
    .pipe(gulp.dest('build'));
});

gulp.task('html', () => {
  gulp.src('app/**/*.html')
    .pipe(htmlmin())
    .pipe(gulp.dest('build'));
});

gulp.task('lintJs', () => {
  return gulp.src('app/js/**/*.js')
    .pipe(eslint({
      "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
          "jsx": true,
          "modules": true,
          "experimentalObjectRestSpread": true
        }
      },
      "env": {
        "browser": true,
        "es6": true,
        "jquery": true,
        "node": true
      },
      "rules": {
        'no-alert': 0,
        'no-bitwise': 0,
        'camelcase': 1,
        'curly': 1,
        'eqeqeq': 0,
        'no-eq-null': 0,
        'guard-for-in': 1,
        'no-empty': 1,
        'no-use-before-define': 0,
        'no-obj-calls': 2,
        'no-unused-vars': 0,
        'new-cap': 1,
        'no-shadow': 0,
        'strict': 2,
        'no-invalid-regexp': 2,
        'comma-dangle': 2,
        'no-undef': 0,
        'no-new': 1,
        'no-extra-semi': 1,
        'no-debugger': 2,
        'no-caller': 1,
        'semi': 1,
        'quotes': 0,
        'no-unreachable': 2,
        'no-trailing-spaces': ["error", { "skipBlankLines": true }],
        'quotes': ["error", "double"],
        'indent': ["error", 2]
      },
      globals: ['$'],
      envs: ['node']
    }))
    .pipe(eslint.format());
});

 gulp.task('bundle-sw', () => {
  return wbBuild.injectManifest({
    swSrc: './app/service-worker.js',
    swDest: './build/service-worker.js',
    globDirectory: './build/',
    globPatterns: ['**\/*.{html,js,css,jpg,jpeg,png,json}'],
  })
  .then(() => {
    console.log('Service worker generated.');
  })
  .catch((err) => {
    console.log('[ERROR] This happened: ' + err);
  });
});

gulp.task('default', ['clean'], (cb) => {
  runSequence( 
    'css',
    'js',
    'html',
    'images',
    'json',
    'lintJs',
    'bundle-sw',
    cb
  );
});

gulp.task('serve', ['default'], () => {
  browserSync.init({
    server: 'build',
    port: 8080
  });
  gulp.watch('app/**/*', ['default']).on('change', browserSync.reload);
});