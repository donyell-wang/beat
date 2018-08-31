# Beat.js
> Never stop the beats ~

This lib will help you detect remote scripts URL change in a Polling way. Thus you can do things like remind the users to reload page, etc.

The theory is simple, that is to keep fetching the current page in text, and compare the differences of `src` in script tags between page loaded and the remote. When there is one or more scripts of the remote page is not included in the current page, a confirm dialog is poped up (see config to modify this default behaviour).

WARNING: To get accurate `src` of script tags in the remote page, `createElement` is used, even though the element is not insert in the document, but there may have some side effects you need to care.

## usage

### via NPM

`npm install beatjs`

or

`yarn add beatjs`

then

```javascript
import Beat from 'beatjs';

Beat.roll();
```

you can call `Beat.stop()` to stop checking.

## config

you may customize some behaviour by passing a config object in.

```javascript
Beat.roll({
  // the polling interval, default to 30s
  interval: 30 * 1000,
  // default to a browser confirm dialog, when Ok is clicked, the location.reload is called.
  onChangeDetected: function (changeList) {
    // changeList is a array of script URL not in current page
    // do things you like
  },
  // the text shown in the confirm dialog mentioned above, default to below
  hintText: '检测到程序更新，请立即刷新页面',
})
```
