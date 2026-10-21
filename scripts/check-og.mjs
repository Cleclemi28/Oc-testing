import sharp from 'sharp';

const buf = await sharp('public/og-image.jpg')
  .extract({ left: 70, top: 250, width: 800, height: 300 })
  .greyscale()
  .stats();

console.log('min/max/mean:', buf.channels[0].min, buf.channels[0].max, buf.channels[0].mean.toFixed(2));

const buf2 = await sharp('public/og-image.jpg')
  .extract({ left: 70, top: 480, width: 800, height: 80 })
  .greyscale()
  .stats();

console.log('subtitle min/max/mean:', buf2.channels[0].min, buf2.channels[0].max, buf2.channels[0].mean.toFixed(2));
