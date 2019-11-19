const { hostname } = require('./constants/common');
const { saveImage, getCounter } = require('./functions/common');

let counter = 0;

const total = getCounter();
const getSyncImage = (hostname: any, number: any) => {
  saveImage(hostname).then(() => {
    if (number !== total - 2) {
      getSyncImage(hostname, counter);
      counter++;
    }
    return;
  });
}

getSyncImage(hostname, counter);
