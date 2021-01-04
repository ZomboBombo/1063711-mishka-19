"use strict";

var gulp = require("gulp");

// --- Препроцессорные утилиты ---
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");

// --- Вспомогательные утилиты ---
var rename = require("gulp-rename");
var del = require("del");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");

// --- HTML-утилиты ---
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require("gulp-htmlmin");

// --- CSS-утилиты ---
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");

// --- JS-утилиты ---
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var pipeline = require("readable-stream").pipeline;

// --- Серверные утилиты ---
var server = require("browser-sync").create();


// *** Обработка всех стилевых файлов и превращение в CSS ***
gulp.task("css", function () {
  return gulp.src("docs/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});


// *** Оптимизация изображений ***
gulp.task("images", function () {
  return gulp.src("docs/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("docs/img"));
});


// *** Создание изображений в формате «.webp» ***
gulp.task("webp", function () {
  return gulp.src("docs/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("docs/img"));
});


// *** Сборка SVG-спрайта ***
gulp.task("sprite", function () {
  return gulp.src("docs/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});


// *** Обработка HTML ***
gulp.task("html", function () {
  return gulp.src("docs/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest("build"));
});


// *** Обработка JS-файлов ***
gulp.task("scripts", function () {
  return pipeline(
    gulp.src("docs/js/**/*.js"),
    uglify(),
    concat("scripts.min.js"),
    gulp.dest("build/js")
  );
});


// *** Работа с Сервером ***
gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("docs/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("docs/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("docs/js/**/*.js", gulp.series("scripts", "refresh"));
  gulp.watch("docs/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});


// *** Очищение директории build/ ***
gulp.task("clean", function () {
  return del("build");
});


// *** Копирование файлов в build/ ***
gulp.task("copy", function () {
  return gulp.src([
    "docs/fonts/**/*.{woff,woff2}",
    "docs/img/**", "!docs/img/icon-*.svg",
    "docs/*.ico"
  ], {
    base: "docs"
  })
  .pipe(gulp.dest("build"));
});


// === Главные задачи для Сборки проекта в "продакшн" и поднятия Сервера ===
gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "scripts",
  "sprite",
  "html"
));

gulp.task("start", gulp.series("build", "server"));
