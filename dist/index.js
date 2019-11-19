"use strict";
var hostname = require('./constants/common').hostname;
var _a = require('./functions/common'), saveImage = _a.saveImage, getCounter = _a.getCounter;
var counter = 0;
var total = getCounter();
var getSyncImage = function (hostname, number) {
    saveImage(hostname).then(function () {
        if (number !== total - 2) {
            getSyncImage(hostname, counter);
            counter++;
        }
        return;
    });
};
getSyncImage(hostname, counter);
