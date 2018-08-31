import 'whatwg-fetch'
import domReady from './domReady'
// import URI from 'urijs';

if (window.Beat) {
  console.warn('BEAT: got same global variable of Beat')
}

let _interval = null
let _settings = {
  interval: 30 * 1000,
  hintText: '检测到程序更新，请立即刷新页面',
  onChangeDetected: (changeList) => {
    // console.log(changeList);
    const result = window.confirm(_settings.hintText)
    if (result) {
      window.location.reload()
    }
  }
}

// const regForSrc = /<script[^(>)]*src\=([^(>\s)]*)/ig

const utils = {
  detect: (onChangeDetected) => {
    // let url = new URI(window.location.href);
    // url.addQuery("_ts", new Date().getTime());
    let url = window.location.href
    let separator = url.indexOf('?') > -1 ? '&' : '?'
    url += separator + encodeURIComponent('_ts') + '=' + encodeURIComponent(new Date().getTime())

    window.fetch(url)
      .then(function (response) {
        if (response.status === 200) {
          return response.text()
        } else {
          throw new Error('error occured while detecting')
        }
      }).then(function (html) {
        const elem = document.createElement('div')
        elem.innerHTML = html

        // compare script tag in current page with remote page
        const current = Array.prototype.slice.call(window.document.getElementsByTagName('script'))
          .map(item => item.src)
          .filter(item => item !== '' && item !== null && item !== undefined)
        const remote = Array.prototype.slice.call(elem.getElementsByTagName('script'))
          .map(item => item.src)
          .filter(item => item !== '' && item !== null && item !== undefined)
        const changeList = utils.diff(current, remote)

        if (changeList.length > 0) {
          onChangeDetected && onChangeDetected(changeList)
        }
      }).catch(function (e) {
        console.log('BEAT:', e)
      })
  },
  diff: (target, source) => {
    // console.log('diff', target, source);
    let changeList = []
    source.map(item => {
      if (!target.includes(item)) {
        changeList.push(item)
      }
    })
    return changeList
  }
}

const Beat = {
  roll: function (config) {
    config && Object.assign(_settings, config)
    domReady(() => {
      utils.detect(_settings.onChangeDetected)
      _interval = setInterval(function () {
        utils.detect(_settings.onChangeDetected)
      }, _settings.interval)
    })
  },
  stop: function () {
    clearInterval(_interval)
  }
}

// window.Beat = window.Beat || Beat;

export default Beat
