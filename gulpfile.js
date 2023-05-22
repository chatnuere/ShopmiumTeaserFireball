const { src, dest, series, parallel, watch } = require("gulp");
const browsersync = require("browser-sync").create();
//const beautify = require('gulp-beautify');
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const terser = require("gulp-terser");
//const htmlmin = require('gulp-htmlmin');
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
//const base64imgs = require('gulp-inline-image-html');
const sort = require("gulp-sort");
const inlineSource = require("gulp-inline-source");
const base64 = require("gulp-base64");

/**************** server task (private) ****************/

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

const syncConfig = {
  server: {
    baseDir: "./",
    index: "index.html",
  },
  port: 8000,
  open: false,
};

// browser-sync
function server(done) {
  browsersync.init(syncConfig);
}

function watche(done) {
  watch("./src/styles/scss/**/*.scss", series(styles, ugly, browserSyncReload));
  watch("./src/scripts/dev/**/*.js", series(scripts, ugly, browserSyncReload));
  watch("*.html", series(browserSyncReload));
  done();
}

function scriptsVendors(done) {
  return src("./src/scripts/dev/vendors/**/*.js") // get all .js files
    .pipe(sort())
    .pipe(concat("vendors.js"))
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(terser())
    .pipe(dest("./src/scripts/concat/all"))
    .pipe(browsersync.stream());
}

function scriptsMain(done) {
  return src("./src/scripts/dev/main.js") // get main.js file
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(terser())
    .pipe(concat("main.js"))
    .pipe(dest("./src/scripts/concat/all"))
    .pipe(browsersync.stream());
}

function scriptsAll(done) {
  return src([
    "./src/scripts/concat/all/vendors.js",
    "./src/scripts/concat/all/main.js",
  ]) // get main.js file
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(terser())
    .pipe(concat("main.js"))
    .pipe(dest("./src/scripts/concat/"))
    .pipe(browsersync.stream());
}

function styles(done) {
  return src("./src/styles/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(base64({
      baseDir: './src/images/',
      extensions: ['png', 'jpg'],
      maxImageSize: 2000000000000 * 1024, // bytes
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(dest("./src/styles/css/min"))
    .pipe(browsersync.stream());
}

function ugly(done) {
  return src(["./src/scripts/concat/main.js"])
    .pipe(terser())
    .pipe(dest("./src/scripts/min"));
}
function inline_files(done) {
  return src("*.html").pipe(inlineSource()).pipe(dest("dist"));
}

const scripts = series(scriptsVendors, scriptsMain, scriptsAll);

exports.server = server;
exports.watch = watche;
exports.style = styles;
exports.scripts = scripts;
exports.prod = series(styles, scripts, ugly, inline_files);
exports.default = series(styles, scripts, ugly, watche, server);
