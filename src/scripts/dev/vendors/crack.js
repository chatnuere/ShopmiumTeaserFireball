// triangulation using https://github.com/ironwallaby/delaunay

const TWO_PI = Math.PI * 2;

var images = [],
  imageIndex = 0;

var image 

var imageWidth
var imageHeight

var vertices = [],
  indices = [],
  fragments = [];

var clickCounter = 0;

var container = document.getElementById('container');

var clickPosition = [imageWidth * 0.5, imageHeight * 0.5];


function imagesLoaded() {
  container.style.width = window.innerWidth + "px";
  container.style.height = window.innerHeight + "px";
  placeImage();
  document.getElementById('packaging').classList.add('visible')
}

function placeImage() {
  image = images[imageIndex];

  if (++imageIndex === images.length) imageIndex = 0;

  // Ajuster les dimensions de l'image en fonction de la taille du conteneur
  var containerWidth = parseFloat(container.style.width);
  var containerHeight = parseFloat(container.style.height);
  var aspectRatioImg = image.naturalWidth / image.naturalHeight;
  var aspectRatioContainer = containerWidth / containerHeight;

  image.id = 'glassImg'
  if (aspectRatioImg < aspectRatioContainer) {
    image.style.width = "100%";
    image.style.height = "auto";
  } else {
    image.style.width = "auto";
    image.style.height = "100%";
  }

  image.addEventListener("click", imageClickHandler);
  container.appendChild(image);
}

function imageClickHandler(event) {

  var imageClickedEvent = new CustomEvent('imageClicked', {
    detail: {
      message: 'This is my custom event'
    },
    bubbles: true,
    cancelable: true
  });

  document.body.dispatchEvent(imageClickedEvent);

  var box = image.getBoundingClientRect(),
    top = box.top,
    left = box.left;

  clickPosition[0] = event.clientX - left;
  clickPosition[1] = event.clientY - top;

  triangulate();
  clickCounter++

  document.getElementById('cta').classList.add('hidden')
  document.getElementById('ctaTxt').classList.add('hidden')
  crackScreen(clickPosition)
  if (clickCounter >= 3) {
    shatter(); // Launch shatter animation only after 3 clicks

    var elements = document.querySelectorAll('#crack');
    elements.forEach(function (element) {
      element.classList.add('done');
    });

    var customEvent = new CustomEvent('finished', {
      detail: {
        message: 'This is my custom event'
      },
      bubbles: true,
      cancelable: true
    });

    document.body.dispatchEvent(customEvent);

    clickCounter = 0; // Reset click counter
  }
}

function crackScreen(clickPosition) {
  var elemDiv = document.createElement('div');
  elemDiv.style.cssText = 'left: ' + clickPosition[0] + 'px; top: ' + clickPosition[1] + 'px; width: ' + imageWidth * 0.6 + 'px; height: ' + imageHeight * 0.6 + 'px; ';
  elemDiv.id = 'crack'
  elemDiv.classList.add('crack-' + clickCounter)
  document.body.appendChild(elemDiv);
}

function triangulate() {
  var rings = [
      {r: 50, c: 12},
      {r: 150, c: 12},
      {r: 300, c: 12},
      {r: 500, c: 12},
      {r: 700, c: 12},
      {r: 900, c: 12},
      {r: 1200, c: 12} // very large in case of corner clicks
    ],
    x,
    y,
    centerX = clickPosition[0],
    centerY = clickPosition[1],
    overflow = 300; // Ajout d'un débordement

  vertices.push([centerX, centerY]);

  rings.forEach(function (ring) {
    var radius = ring.r,
      count = ring.c,
      variance = radius * 0.25;

    for (var i = 0; i < count; i++) {
      x = Math.cos((i / count) * TWO_PI) * radius + centerX + randomRange(-variance, variance);
      y = Math.sin((i / count) * TWO_PI) * radius + centerY + randomRange(-variance, variance);
      vertices.push([x, y]);
    }
  });

  vertices.forEach(function (v) {
    v[0] = clamp(v[0], -overflow, imageWidth + overflow); // Inclure le débordement
    v[1] = clamp(v[1], -overflow, imageHeight + overflow); // Inclure le débordement
  });

  indices = Delaunay.triangulate(vertices);
}

function shatter() {
  image.classList.add('rororo')
  var p0, p1, p2,
    fragment;

  var tl0 = new TimelineMax({onComplete: shatterCompleteHandler});

  for (var i = 0; i < indices.length; i += 3) {
    p0 = vertices[indices[i + 0]];
    p1 = vertices[indices[i + 1]];
    p2 = vertices[indices[i + 2]];

    fragment = new Fragment(p0, p1, p2);

    var dx = fragment.centroid[0] - clickPosition[0],
      dy = fragment.centroid[1] - clickPosition[1],
      d = Math.sqrt(dx * dx + dy * dy),
      rx = 30 * sign(dy),
      ry = 90 * -sign(dx),
      delay = d * 0.003 * randomRange(0.9, 1.1);
    fragment.canvas.style.zIndex = Math.floor(d).toString();


    var tl1 = new TimelineMax();


    tl1.to(fragment.canvas, 1, {
      z: -500,
      rotationX: rx,
      rotationY: ry,
      ease: Cubic.easeIn
    });
    tl1.to(fragment.canvas, 0.4, {alpha: 0}, 0.6);

    tl0.insert(tl1, delay);

    fragments.push(fragment);
    container.appendChild(fragment.canvas);
  }

  image.classList.add('yoyo')

  setTimeout(function () {
    document.getElementById('baygay2').classList.add('scaled')
  }, 1500)
  setTimeout(function (){
    document.getElementById('cold_dring').classList.add('animate__animated', 'animate__backInUp')
  }, 2000)
  image.removeEventListener('click', imageClickHandler);
}

function shatterCompleteHandler() {
  // add pooling?
  fragments.forEach(function (f) {
    container.removeChild(f.canvas);
  });
  fragments.length = 0;
  vertices.length = 0;
  indices.length = 0;

}

//////////////
// MATH UTILS
//////////////

function randomRange(min, max) {
  return min + (max - min) * Math.random();
}

function clamp(x, min, max) {
  return x < min ? min : (x > max ? max : x);
}

function sign(x) {
  return x < 0 ? -1 : 1;
}

//////////////
// FRAGMENT
//////////////

var Fragment = function (v0, v1, v2) {
  this.v0 = v0;
  this.v1 = v1;
  this.v2 = v2;

  this.computeBoundingBox();
  this.computeCentroid();
  this.createCanvas();
  this.clip();
};

Fragment.prototype = {
  computeBoundingBox: function () {
    var xMin = Math.min(this.v0[0], this.v1[0], this.v2[0]),
      xMax = Math.max(this.v0[0], this.v1[0], this.v2[0]),
      yMin = Math.min(this.v0[1], this.v1[1], this.v2[1]),
      yMax = Math.max(this.v0[1], this.v1[1], this.v2[1]);

    this.box = {
      x: xMin,
      y: yMin,
      w: xMax - xMin,
      h: yMax - yMin
    };
  },
  computeCentroid: function () {
    var x = (this.v0[0] + this.v1[0] + this.v2[0]) / 3,
      y = (this.v0[1] + this.v1[1] + this.v2[1]) / 3;

    this.centroid = [x, y];
  },
  createCanvas: function () {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.box.w;
    this.canvas.height = this.box.h;
    this.canvas.style.width = this.box.w + 'px';
    this.canvas.style.height = this.box.h + 'px';
    this.canvas.style.left = this.box.x + 'px';
    this.canvas.style.top = this.box.y + 'px';
    this.ctx = this.canvas.getContext('2d');
  },
  clip: function () {
    this.ctx.translate(-this.box.x, -this.box.y);
    this.ctx.beginPath();
    this.ctx.moveTo(this.v0[0], this.v0[1]);
    this.ctx.lineTo(this.v1[0], this.v1[1]);
    this.ctx.lineTo(this.v2[0], this.v2[1]);
    this.ctx.closePath();
    this.ctx.clip();

    // Prendre en compte les dimensions ajustées de l'image
    var scaleX = image.clientWidth / image.naturalWidth;
    var scaleY = image.clientHeight / image.naturalHeight;
    this.ctx.drawImage(
      image,
      this.box.x / scaleX,
      this.box.y / scaleY,
      this.box.w / scaleX,
      this.box.h / scaleY,
      this.box.x,
      this.box.y,
      this.box.w,
      this.box.h
    );
  }
};
