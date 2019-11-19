const https = require('https');
const jsdom = require('jsdom');
const fs = require('fs');
const { headers } = require('../constants/common');

const chars = 'qwertyuiopasdfghjklzxcvbnm0123456789';



const getFileId = () => {
  let fileId = 'p';

  for (let i=0; i<5; i++) {
    fileId += chars[Number.parseInt(String(Math.random() * (chars.length - 1)))];
  }

  return fileId;
};

const getBinaryData = (url: string): Promise<Buffer> => new Promise(resolve => https.get(
  url,
  { headers },
  (res: any) => {
    let buffer = Buffer.from('');
    res.on('data', (chunk: any) => { buffer = Buffer.concat([buffer, chunk]); });
    res.on('end', () => {
      resolve(buffer);
    });
  })
);

const getImageUrl = (url: string): Promise<string> => new Promise(resolve => https.get(
  url,
  { headers },
  (res: any) => {
    let rawData = '';
    res.on('data', (chunk: any) => { rawData += chunk; });
    res.on('end', () => {
      const dom = new jsdom.JSDOM(rawData);

      const image = dom.window.document.querySelector('.image-container.image__pic.js-image-pic .no-click.screenshot-image');
      const src = image && image.src;
      resolve(src && src.indexOf('st.prntscr.com') === -1 ? src : null);
    });
  })
);

const pathToSaveImagesArg = process.argv.find(item => item.includes('--path-to-save='));
const pathToSaveImages = pathToSaveImagesArg && pathToSaveImagesArg.substring(15);

module.exports = {
  saveImage: async (url: string): Promise<boolean> => {
    const fileId = getFileId();
    console.log('fileId: ', fileId);
    const imageUrl = await getImageUrl(`${url}${fileId}`);
    console.log('imageUrl: ', imageUrl);
    if (!imageUrl) {
      return Promise.resolve(false);
    }

    const binaryData = await getBinaryData(imageUrl);
    fs.mkdir(`${pathToSaveImages}`, { recursive: true }, (err: any) => {
      if (err) throw err;
    })
    fs.writeFile( `${pathToSaveImages}/${fileId}.png`, binaryData, 'binary', (err: any) => {
      console.log(err);
    })

    return Promise.resolve(true);
  },
  getCounter: (): number => {
    const value = process.argv.find(item => item.includes('--counter='));
    return Number(value && value.substring(10)) || 0;
  }
};
