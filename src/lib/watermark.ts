import sharp from "sharp";

export async function applyWatermark(imageBuffer: Buffer): Promise<Buffer> {
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width || 1024;
  const height = metadata.height || 1024;

  // Diagonal repeating watermark text
  const svgOverlay = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="wm" patternUnits="userSpaceOnUse"
                 width="350" height="200"
                 patternTransform="rotate(-30)">
          <text x="10" y="100"
                font-family="Georgia, serif"
                font-size="28"
                fill="white"
                fill-opacity="0.25"
                font-weight="bold">
            RoyalPet.app
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wm)"/>
    </svg>`;

  return sharp(imageBuffer)
    .composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
    ])
    .webp({ quality: 85 })
    .toBuffer();
}
