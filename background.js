/*
 * Copyright (c) 2014 Jason Kridner <jdk@ti.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*
 * Based on the work of Vlad V. Ungureanu <ungureanuvladvictor@gmail.com>
 * per
 * https://github.com/ungureanuvladvictor/BBBlfs
 */

var beagleboot = (function () {
  var instance;

  function init() {
    console.log("BeagleBoot initialized.");

    var devices = {};
    var searchTimer;

    var ROM =    { vendorId:  1105, productId: 24897 };
    var SPL =    { vendorId:  1317, productId: 42146 };
    var UBOOT =  { vendorId:  1317, productId: 42149 };
    var SERIAL = { vendorId:  1317, productId: 42151 }; 

    function start() {
      console.log("BeagleBoot started.");
      if(!searchTimer) {
        searchTimer = setInterval(search, 3000);
      }
    }

    function search() {
      console.log("BeagleBoot searching for devices in ROM bootloader mode.");
      chrome.usb.findDevices(ROM, found_devices);

      function found_devices(devices) {
        if(chrome.runtime.lastError != undefined) {
          console.warn('chrome.usb.findDevices error :' +
            chrome.runtime.lastError.message);
          return;
        }

        if(devices.length == 0) {
          console.log('BeagleBoot found no USB devices.');
          return;
        }

        if(searchTimer) clearInterval(searchTimer);
        searchTimer = false;

        for(var device of devices) {
          var deviceInfo = {
            'device': device
          };
          console.log("USB device found: " + deviceInfo);
        }
      }
    }

    return {
      start: start
    }
  }

  function get() {
    if(!instance) {
      instance = init();
    }

    return(instance);
  }

  return {
    get: get
  }
})();

var boot = beagleboot.get();

document.addEventListener('DOMContentLoaded', boot.start);

