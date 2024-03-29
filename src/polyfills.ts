/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

 (function(elmProto){
  if ('scrollTopMax' in elmProto) {
      return;
  }
  Object.defineProperties(elmProto, {
    'scrollTopMax': {
      get: function scrollTopMax(this: HTMLElement) {
        return this.scrollHeight - this.clientHeight;
      }
    },
    'scrollLeftMax': {
      get: function scrollLeftMax(this: HTMLElement) {
        return this.scrollWidth - this.clientWidth;
      }
    },
    'isMaxScrollTop': {
      get: function isMaxScrollTop(this: HTMLElement) {
        return this.scrollHeight - Math.abs(this.scrollTop) - this.clientHeight < 1;
      }
    },
    'isMaxScrollLeft': {
      get: function isMaxScrollLeft(this: HTMLElement) {
        return this.scrollWidth - Math.abs(this.scrollLeft) - Math.floor(this.clientWidth) < 1;
      }
    }
  });
 })(HTMLElement.prototype);

String.prototype.insert = function(index: number, what: string) {
  return index > 0
      ? this.replace(new RegExp('.{' + index + '}'), '$&' + what)
      : what + this;
};
String.prototype.delete = function(from: number, length: number = 1) {
  return this.substring(0, from) + this.substring(from + length, this.length);
}
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
Array.prototype.equals = function<T = any>(this: Array<T>, array: Array<T>) {
  // if the other array is a falsy value, return
  if (!array)
  return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length)
    return false;

  for (var i = 0, l=this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!(this[i] as unknown as Array<any>).equals<any>(array[i] as unknown as Array<any>))
            return false;
    }
    else if (this[i] != array[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
    }
  }
  return true;
}
Array.prototype.insert = function <T = any>(this: Array<T>, index: number, item: T) {
  this.splice( index, 0, item );
}
/** 
 * Compute the factorial of a number (!x)
 * If the number is < 0 it returns -1
 */
Math.factorial = (num: number) => {
  if (num < 0) 
    return -1;
  else if (num == 0) 
    return 1;
  else
    return (num * Math.factorial(num - 1));
}

Math.clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

if (window.JSON && !window.JSON.dateParser) {
  var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
  var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

  JSON.dateParser = function (key, value) {
      if (typeof value === 'string') {
          var a = reISO.exec(value);
          if (a)
              return new Date(value);
          a = reMsAjax.exec(value);
          if (a) {
              var b = a[1].split(/[-+,.]/);
              return new Date(b[0] ? +b[0] : 0 - +b[1]);
          }
      }
      return value;
  };
}

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will work for all browsers.
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
 *
 *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 *  with the following flag, it will bypass `zone.js` patch for IE/Edge
 *
 *  (window as any).__Zone_enable_cross_context_check = true;
 *
 */

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js';  // Included with Angular CLI.


/***************************************************************************************************
 * APPLICATION IMPORTS
 */
