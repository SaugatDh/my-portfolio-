const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputDir = path.join(__dirname, '..', 'files');
const outputDir = path.join(inputDir, 'optimized');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function optimize(file) {
  const inputPath = path.join(inputDir, file);
  const base = path.parse(file).name;
  const outWebp = path.join(outputDir, `${base}.webp`);
  const outSmall = path.join(outputDir, `${base}-400.webp`);

  try {
    await sharp(inputPath)
      .resize({ width: 1200 })
      .webp({ quality: 80 })
      .toFile(outWebp);

    await sharp(inputPath)
      .resize({ width: 400 })
      .webp({ quality: 70 })
      .toFile(outSmall);

    console.log(`Optimized ${file} -> ${path.relative('.', outWebp)}, ${path.relative('.', outSmall)}`);
  } catch (err) {
    console.error(`Failed to optimize ${file}:`, err.message);
  }
}

(async () => {
  const files = fs.readdirSync(inputDir).filter(f => /png|jpe?g|webp$/i.test(f));
  for (const f of files) {
    await optimize(f);
  }
})();
