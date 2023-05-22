
(function () {
  var mainTimeout;
  var cta = document.getElementById("cta");
  var content = document.getElementById("content");
  var finished = false;
  var showBtn = function (timeout) {
    setTimeout(function () {
      if (finished) return;
      finished = true;
      Native.fireEvent("showButton");
    }, timeout);
  };

  var startMainTimeout = function () {
    mainTimeout = setTimeout(function () {
      showBtn(0);
    }, 9000);
  };

  var start = function (size) {
    startMainTimeout();

    imageWidth = window.innerWidth,
    imageHeight = window.innerHeight;

    TweenMax.set(container, { perspective: 800 });

    // Replace the following string with your own base64 data

    images[0] = image = new Image();
    image.onload = function () {
      imagesLoaded();
    };
    image.src = base64ImageData;

    document.getElementById("content").addEventListener(
      "touchstart",
      function (e) {
        //e.preventDefault();
      },
      false
    );

    document.getElementById("content").addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();
      },
      false
    );
  };

  var preload = function () {
    if (window.innerHeight > 0) {
      var cont = document.getElementById("content");
      start({ width: cont.offsetWidth, height: cont.offsetHeight });
    } else {
      setTimeout(function () {
        preload();
      }, 10);
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    preload();
  });
})();
