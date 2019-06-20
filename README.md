# Choose Your Own Adventuresque

A touchscreen app demo by Toby Harris. The generic bones of some commercial work, tidied up and with a own-brand look. Replace the placeholder ‘adventure’ in `content.js`. Adapt the look or functionality as you like, or better still commission me for lots more whizz-bangery.

- http://sparklive.net
- http://tobyz.net

Runs in a browser. Created with [PixyJS](https://www.pixijs.com) v5, written in ES2018. 

### Dev

- Needs to be served from localhost
  e.g. `Brackets` editor app, with live preview in Chrome or Safari
- Chrome 
  - Has a SVG `drawImage` bug, which can lead to clipped artwork (possibly caused by non-native monitor resolution on OS X)
  - For media playback, Chrome should have following flags set  
    `chrome://flags` → `#autoplay-policy` → `No user gesture is required`
  - For video with alpha channel playback, Chrome with WebM tested to work  
    `chrome://flags` → `#autoplay-policy` → `No user gesture is required`
  - Something not right? Do a Chrome full reload  
    `Command-Shift-R`
- Safari 
  - On my laptop, app feels slightly smoother
  - Video untested
- Bundled PIXI is a fork of 5.0.4, to allow rasterising SVG assets at a fixed size
  - Source: [tobyspark/pixi.js at SVGResource tests](https://github.com/tobyspark/pixi.js/tree/57cf0c733a0912cde01289a0a8d89609152eeed7)
  - PR: [SVGResource constructor has absolute size options](https://github.com/pixijs/pixi.js/pull/5776)

### Production

1. Install Python3 from [python.org](http://python.org) if not installed (e.g. `which python3`)
1. Install Google Chrome if not installed (or choose another browser and alter `RUNME` script)
1. Set `RUNME.bash` to open in `Terminal` (OS X), or...
1. Double-click `RUNME.bash` (OS X), or...
