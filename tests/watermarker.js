const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const promise = require('bluebird');
const im = require('imagemagick');
const watermark = require('../lib/watermarker');

const expect = chai.expect;
chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('watermarker', function () {
  describe('CLI', function () {
    describe('No watermark text', function () {
      it('should throw', function () {
        return watermark.addWaterMark('./tests/files/Brad.png')
          .should.eventually.be.rejected
          .and.have.property('message').which.equals('NoWatermark');
      });
    });

    describe('No file argument', function () {
      it('should throw', function () {
        return watermark.addWaterMark('', 'My Watermark')
          .should.eventually.be.rejected
          .and.have.property('message').that.equals('MissingInputFilePath');
      });
    });

    describe('Input File missing', function () {
      it('should throw', function () {
        return watermark.addWaterMark('./tests/files/FakeFile.png', 'My Watermark')
          .should.eventually.be.rejected
          .and.have.property('message').that.equals('MissingInputFile');
      });
    });

    describe('Input File is directory', function () {
      it('should throw', function () {
        return watermark.addWaterMark('./tests/files', 'My Watermark')
          .should.eventually.be.rejected
          .and.have.property('message').that.equals('InvalidInputFile');
      });
    });

    describe('Input File is file', function () {
      before(function() {
        sinon.stub(im, 'convertAsync').callsFake((args) => {
          return promise.resolve();
        });
      });

      after(function () {
        im.convertAsync.restore();
      });

      it('should not throw', function () {
        return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark')
          .should.eventually.be.fulfilled;
      });

      it('should call im.convert', function () {
        expect(im.convertAsync).to.be.calledWith([
          './tests/files/Brad.png',
          '-size',
          '148x200',
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          'My Watermark',
          './tests/files/watermarked_Brad.png'
        ]);
      });
    });

    describe('Failed to get Image info.', function () {
      before(function() {
        sinon.stub(im, 'identify').callsFake((source, cb) => {
          return cb(new Error('Snap!'));
        });
      });
      after(function () {
        im.identify.restore();
      });

      it('should throw', function () {
        return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark')
          .should.eventually.be.rejected
          .and.have.property('message').that.equals('ImageInfoError');
      });
    });

    describe('Invalid Position', function () {
         before(function() {
            sinon.stub(im, 'convertAsync').callsFake((args) => {
            return promise.resolve();
            });
        });

        after(function () {
            im.convertAsync.restore();
        });

        it('should throw', function () {
           return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'invalid' })
                .should.eventually.be.rejected
                .and.have.property('message').that.equals('InvalidPosition');
        });
    });

    describe('Case-Insensitive Position', function () {
         before(function() {
            sinon.stub(im, 'convertAsync').callsFake((args) => {
            return promise.resolve();
            });
        });

        after(function () {
            im.convertAsync.restore();
        });

        it('should not throw when all caps', function () {
           return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'RIGHT' })
                .should.eventually.be.fulfilled;
        });

        it('should not throw when all lower case', function () {
           return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'right' })
                .should.eventually.be.fulfilled;
        });

        it('should not throw when camel case', function () {
           return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'topLeft' })
                .should.eventually.be.fulfilled;
        });

        it('should not throw when title case', function () {
           return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'Right' })
                .should.eventually.be.fulfilled;
        });
    });

    describe('Position', function () {
         before(function() {
            sinon.stub(im, 'convertAsync').callsFake((args) => {
            return promise.resolve();
            });
        });

        after(function () {
            im.convertAsync.restore();
        });

        it('should call with NorthWest when TopLeft', function () {
          return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'TopLeft' })
                .should.eventually.be.fulfilled;

          expect(im.convertAsync).to.be.calledWith([
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              '-gravity',
              'NorthWest',
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any
            ]);
        });

        it('should call with North when Top', function () {
          return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'Top' })
                .should.eventually.be.fulfilled;

          expect(im.convertAsync).to.be.calledWith([
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              '-gravity',
              'North',
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any
            ]);
        });

        it('should call with NorthEast when TopRight', function () {
          return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'TopRight' })
                .should.eventually.be.fulfilled;

          expect(im.convertAsync).to.be.calledWith([
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              '-gravity',
              'NorthEast',
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any
            ]);
        });

        it('should call with West when Left', function () {
          return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'Left' })
                .should.eventually.be.fulfilled;

          expect(im.convertAsync).to.be.calledWith([
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              '-gravity',
              'West',
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any
            ]);
        });

        it('should call with Center when Center', function () {
          return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'Center' })
                .should.eventually.be.fulfilled;

          expect(im.convertAsync).to.be.calledWith([
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              '-gravity',
              'Center',
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any
            ]);
        });

        it('should call with East when Right', function () {
          return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'Right' })
                .should.eventually.be.fulfilled;

          expect(im.convertAsync).to.be.calledWith([
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              '-gravity',
              'East',
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any
            ]);
        });

        it('should call with SouthWest when bottomLeft', function () {
          return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'BottomLeft' })
                .should.eventually.be.fulfilled;

          expect(im.convertAsync).to.be.calledWith([
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              '-gravity',
              'SouthWest',
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any
            ]);
        });

        it('should call with South when Bottom', function () {
          return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'Bottom' })
                .should.eventually.be.fulfilled;

          expect(im.convertAsync).to.be.calledWith([
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              '-gravity',
              'South',
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any
            ]);
        });

        it('should call with SouthEast when BottomRight', function () {
          return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { position: 'BottomRight' })
                .should.eventually.be.fulfilled;

          expect(im.convertAsync).to.be.calledWith([
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              '-gravity',
              'SouthEast',
              sinon.match.any,
              sinon.match.any,
              sinon.match.any,
              sinon.match.any
            ]);
        });
    });

     describe('Font Size', function () {
      before(function() {
        sinon.stub(im, 'convertAsync').callsFake((args) => {
          return promise.resolve();
        });
      });

      after(function () {
        im.convertAsync.restore();
      });

      it('should not throw', function () {
        return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { fontSize: 72 })
          .should.eventually.be.fulfilled;
      });

      it('should call im.convert with 72', function () {
        expect(im.convertAsync).to.be.calledWith([
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          '-pointsize',
          72,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any
        ]);
      });
    });

     describe('Font Colour', function () {
      before(function() {
        sinon.stub(im, 'convertAsync').callsFake((args) => {
          return promise.resolve();
        });
      });

      after(function () {
        im.convertAsync.restore();
      });

      it('should not throw', function () {
        return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { colour: 'rgba(255,0,0,0.8)' })
          .should.eventually.be.fulfilled;
      });

      it('should call im.convert with rgba(255,0,0,0.8)', function () {
        expect(im.convertAsync).to.be.calledWith([
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          '-fill',
          'rgba(255,0,0,0.8)',
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any
        ]);
      });
    });

    describe('Angle', function () {
      before(function() {
        sinon.stub(im, 'convertAsync').callsFake((args) => {
          return promise.resolve();
        });
      });

      after(function () {
        im.convertAsync.restore();
      });

      it('should not throw', function () {
        return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { rotation: '180' })
          .should.eventually.be.fulfilled;
      });

      it('should call im.convert with 180', function () {
        expect(im.convertAsync).to.be.calledWith([
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          sinon.match.any,
          '-annotate',
          180,
          sinon.match.any,
          sinon.match.any
        ]);
      });
    });

    describe('Invalid Angle', function () {
      before(function() {
        sinon.stub(im, 'convertAsync').callsFake((args) => {
          return promise.resolve();
        });
      });

      after(function () {
        im.convertAsync.restore();
      });

      it('should throw', function () {
        return watermark.addWaterMark('./tests/files/Brad.png', 'My Watermark', { rotation: 'Hello' })
          .should.eventually.be.rejected
          .and.have.property('message').that.equals('InvalidAngle');
      });
    });
  });
});