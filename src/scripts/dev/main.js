(function () {
  var cta = document.getElementById("cta");
  var content = document.getElementById("content");
  var finished = false;
  var clickInterval;
  var showBtn = function (timeout) {
    clearInterval(clickInterval)
    setTimeout(function () {
      if (finished) return;
      finished = true;
      Native.fireEvent("showButton");
    }, timeout);
  };

  var startMainTimeout = function () {
    mainTimeout = setTimeout(function () {
      randomClick()

      clickInterval = setInterval( function () {
        randomClick()
      }, 1000)
    }, 9000);
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

    document.body.addEventListener('finished', function(e) {
      showBtn(2500)
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
