// This function changes the background color on each page reload
(function () {
  // Read cookie
  function readCookie (name) {
    var nameEQ = name + '='
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length)
      }
    }
    return null
  }

  const bgColors = ['mint', 'apricot', 'lavender']

  let bgColorIdx = readCookie('bgColorIdx')
  let newBgColorIdx = 0
  if (bgColorIdx !== null) {
    bgColorIdx = parseInt(bgColorIdx, 10)
    newBgColorIdx = (bgColorIdx + 1) % bgColors.length
  }
  document.cookie = 'bgColorIdx=' + newBgColorIdx + '; path=/'
  const body = document.querySelector('body');
  body.classList.add('bg-' + bgColors[newBgColorIdx])
  body.classList.remove('bg-' + bgColors[bgColorIdx])
})();

/* this will update the opacity of the elephant ascii based on mobile scroll */
(function () {
  if (window.innerWidth < 600) {
    function throttle (func, wait, options) {
      var context, args, result
      var timeout = null
      var previous = 0
      if (!options) {
        options = {}
      }
      var later = function () {
        previous = options.leading === false ? 0 : Date.now()
        timeout = null
        result = func.apply(context, args)
        if (!timeout) {
          context = args = null
        }
      }
      return function () {
        var now = Date.now()
        if (!previous && options.leading === false) {
          previous = now
        }
        var remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout)
            timeout = null
          }
          previous = now
          result = func.apply(context, args)
          if (!timeout) {
            context = args = null
          }
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining)
        }
        return result
      }
    }

    /* from http://www.javascriptkit.com/javatutors/detect-user-scroll-amount.shtml */
    function getDocHeight () {
      var D = document
      return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
      )
    }

    function getScrollPercent () {
      var winheight = window.innerHeight || (document.documentElement || document.body).clientHeight
      var docheight = getDocHeight()
      var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
      var trackLength = docheight - winheight
      return scrollTop / trackLength
    }

    function updateOpacity () {
      // use a max so that it never goes back down.
      // this could be optimized by removing the handler instead
      document.getElementById('elephant-ascii').style.opacity = Math.max(
        document.getElementById('elephant-ascii').style.opacity,
        getScrollPercent()
      )
    }

    throttled = throttle(updateOpacity, 100);
    window.addEventListener('scroll', throttled);
  }
})();
