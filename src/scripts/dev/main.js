(function () {
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

  var startMainTimeout = function (timeout) {
    mainTimeout = setTimeout(function () {
      console.log('yolo')
      randomClick()
    }, timeout);
  };

  var randomClick = function() {
    var element = document.getElementById("glassImg");

    if (element) {
      var rect = element.getBoundingClientRect();
      var randomX = Math.floor(Math.random() * rect.width);
      var randomY = Math.floor(Math.random() * rect.height);

      var clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'clientX': rect.left + randomX,
        'clientY': rect.top + randomY
      });

      element.dispatchEvent(clickEvent);
    }
  }

  var start = function (size) {
    startMainTimeout(9000);

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

    document.body.addEventListener('finished', function(e) {
      showBtn(3000)
    });
    document.body.addEventListener('imageClicked', function(e) {
      clearTimeout(mainTimeout)
      startMainTimeout(6000)
    });
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
