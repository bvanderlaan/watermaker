# Watermarker

[![NPM version][npm-image]][npm-url]
[![Dependencies][david-image]][david-url]
[![devDependencies][david-dev-image]][david-dev-url]

Watermarker is a simple CLI tool for inserting a watermark on images.

## Why Watermarker?

*This is my tool, there are many like it but this one is mine.*
Basically I was in need of a tool which I could use to watermark a number of photos of my wifes paintings and did not find one that suited me so I made my own.

I wanted a simple tool that I could point at a image file and have it put some text on it to mark it as my wifes original work.
As I'm expecting to do this often I wanted a simple command line tool vs having to open Paint.Net or Photoshop up and manually watermark.

I did find others who have written similar tools but most seemed to be packages to embedded in your server side code to watermark on the fly.
My needs are met by a simple one time watermarking prior to upload so `watermarker` was born.

## How to Use

`watermarker` is a Command line tool so its operated by arguments.

```
Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -t, --text <watermark>     The text to put over the image.
    -o, --outdir [path]        Path to save watermarked images to.
    -c, --colour [rgba]        Colour to use for watermark text. Defaults to semi-transparent black
    -s, --font-size [point]    The font size to use in Points.
    -p, --position [position]  Location on the image to place the watermark.
              TopLeft, Top, TopRight, Left, Center, Right, BottomLeft, Bottom, BottomRight
    -r, --rotation [degree]    Angle to write the watermark text at. Defaults to 0
```

As a minimum you need to provide a path to an image file to watermark and the text to use as the watermark.

```
$ watermarker ~/myImage.jpeg --text "Brad 2017"
```

This will copy your image file (`~/watermarked_myImage.jpeg`) and place the text *Brad 2017* in semi-transparent black in the bottom right hand corner.

### Colour

You can specify the colour via the `--colour` flag; you can also use the short form `-c`

```
$ watermarker ~/myImage.jpeg --text "Brad 2017" --colour red
$ watermarker ~/myImage.jpeg --text "Brad 2017" --colour #FF00FF
$ watermarker ~/myImage.jpeg --text "Brad 2017" --colour 'rgba(0,255,255,0.8)'
```
### Font Size

You can specify the font size via the `--font-size` (`-s`) flag.
This flag expects a font size in points (12pt, 16pt, etc.) and defaults to 12pt.

```
$ watermarker ~/myImage.jpeg --text "Brad 2017" --font-size 16
```
### Position

You can specify where on the image to place the watermark via the `--position` (`-p`) flag.
You can place the watermark in the following locations:
* TopLeft
* Top
* TopRight
* Left
* Center
* Right
* BottomLeft
* Bottom
* BottomRight

```
$ watermarker ~/myImage.jpeg --text "Brad 2017" --position TopLeft
```

### Rotation

You can specify to write the watermark on an angle via the `--rotation` (`-r`) flag.
This flag expects an angle value in degrees where 0 is along the X-axis, 90 is along the Y-axis, and 180 is upside down along the X-axis.

To write the watermark text on an diagonal:

```
$ watermarker ~/myImage.jpeg --text "Brad 2017" --position Center --rotation 45
```

### Output Location

By default `watermarker` will save the watermarked version of the file in the same directory as the source image however you can override that with the `--outdir` (`-o`) flag.

```
$ watermarker ~/myImage.jpeg --text "Brad 2017" --outdir ~/watermarked
```

## How to install

```
npm install cli-watermarker
```

## Donations

If you like `watermarker` and want to support it and other open source work that I do you can do so via [Gratipay](https://gratipay.com/~bvanderlaan/).

[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.svg)](https://gratipay.com/~bvanderlaan/)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/bvanderlaan/watermarker. This project is intended to be a safe, welcoming space for
collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).


[npm-image]: http://img.shields.io/npm/v/cli-watermarker.svg?style=flat
[npm-url]: https://npmjs.org/package/cli-watermarker
[david-image]: http://img.shields.io/david/bvanderlaan/cli-watermarker.svg?style=flat
[david-url]: https://david-dm.org/bvanderlaan/cli-watermarker
[david-dev-image]: http://img.shields.io/david/dev/bvanderlaan/cli-watermarker.svg?style=flat
[david-dev-url]: https://david-dm.org/bvanderlaan/cli-watermarker#info=devDependencies