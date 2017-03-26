const path = require('path');
const promise = require('bluebird');
const fs = promise.promisifyAll(require('fs'));
const im = promise.promisifyAll(require('imagemagick'));

module.exports = {
    /**
     * Generates a new Image with watermarking.
     * @param {String} inputFile is the full path to the source imag file to watermark.
     * @param {String} watermarking is the text to superimpose over the image.
     * @param {Object} options is a set of options to apply to the watermarking.
     * @param {String} options.colour is the colour to use for the watermarking. Example: 'rgba(0,0,0,0.5)'
     * @param {String} options.outdir is the full path to save the new image to.
     * @param {String} options.position is the location on the image to place the watermarking.
     * @param {Stirng} options.rotation is the angle to write the watermark text
     */
    addWaterMark: (inputFile, watermarking, options) => {
        if (!watermarking) {
          return promise.reject(new Error('NoWatermark'));
        }

        if (!inputFile) {
          return promise.reject(new Error('MissingInputFilePath'));
        }

        const opt = options || {}

        const position = convertPosition(opt.position || 'BottomRight');

        if (position === undefined) {
          return promise.reject(new Error('InvalidPosition'));
        }

        let angle;
        try {
            angle = parseAngle(opt.rotation) || 0;
        } catch(err) {
            return promise.reject(err);
        }

        const outDir = opt.outdir || path.dirname(inputFile);
        const output = `${outDir}/watermarked_${path.basename(inputFile)}`;
        const colour = opt.colour || 'rgba(0,0,0,0.5)';
        const fontSize = opt.fontSize || 12;

        return promise.resolve(inputFile)
          .then(getFileInfo)
          .then(throwIfNotFile)
          .then(() => getImageInfo(inputFile))
          .then((imageInfo) => {
            return args = [
              inputFile,
              '-size',
              `${imageInfo.width}x${imageInfo.height}`,
              '-fill',
              colour,
              '-pointsize',
              fontSize,
              '-gravity',
              position,
              '-annotate',
              angle,
              watermarking,
              output,
            ];
          })
          .then(im.convertAsync)
          .then(() => output);
    }
};

function getFileInfo(file) {
  return fs.statAsync(file)
    .catch((err) => {
      throw new Error('MissingInputFile');
    });
}

function throwIfNotFile(fileInfo) {
  if (!fileInfo.isFile()) {
    throw new Error('InvalidInputFile');
  }
}

function getImageInfo(filePath) {
  return im.identifyAsync(filePath)
    .catch((err) => {
      throw new Error('ImageInfoError');
    });
}

function convertPosition(position) {
    const pos = {
        topleft: 'NorthWest',
        top: 'North',
        topright: 'NorthEast',
        left: 'West',
        center: 'Center',
        right: 'East',
        bottomleft: 'SouthWest',
        bottom: 'South',
        bottomright: 'SouthEast',
    };

    return pos[position.toLowerCase()];
}

function parseAngle(angle) {
    if (angle === undefined ) {
        return angle;
    }

    const degree = parseInt(angle);
    if (isNaN(degree)) {
        throw new Error('InvalidAngle')
    }
    return degree;
}
