(function () {
  var mainTimeout;
  var cta = document.getElementById('cta')
  var content = document.getElementById('content')

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
  }

  var start = function (size) {
    startMainTimeout()

    document.getElementById('content').addEventListener("touchstart", function (e) {
      e.preventDefault();
    }, false);

    document.getElementById('content').addEventListener("touchmove", function (e) {
      e.preventDefault();
    }, false);

  };

  var preload = function () {
    if (window.innerHeight > 0) {
      var cont = document.getElementById('content')
      start({width: cont.offsetWidth, height: cont.offsetHeight})

    } else {
      setTimeout(function () {
        preload();
      }, 10)
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    preload()
  });
}());

