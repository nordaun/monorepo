"use client";

/**
 * ## Convert Image
 * Converts an image file to a websafe format (WEBP) and optionally resizes it.
 * @param file the file to convert
 * @param width the width to resize to
 * @param height the height to resize to
 * @returns the converted file
 */
export default function convertImage(
  file: File,
  width: number | undefined,
  height: number | undefined
): Promise<File | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onerror = () => resolve(null);

    reader.onload = () => {
      const image = new Image();
      image.src = reader.result as string;

      image.onerror = () => resolve(null);

      image.onload = () => {
        const originalWidth = image.width;
        const originalHeight = image.height;
        const originalAspectRatio = originalWidth / originalHeight;

        let targetWidth: number, targetHeight: number;

        if (width && height) {
          targetWidth = width;
          targetHeight = height;
        } else if (width) {
          targetWidth = width;
          targetHeight = Math.round(targetWidth / originalAspectRatio);
        } else if (height) {
          targetHeight = height;
          targetWidth = Math.round(targetHeight * originalAspectRatio);
        } else {
          targetWidth = originalWidth;
          targetHeight = originalHeight;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Crop and center the image to preserve aspect ratio
        const targetAspect = targetWidth / targetHeight;
        const imageAspect = originalAspectRatio;

        let sx = 0,
          sy = 0,
          sw = originalWidth,
          sh = originalHeight;

        if (imageAspect > targetAspect) {
          // Image is wider than target
          sw = originalHeight * targetAspect;
          sx = (originalWidth - sw) / 2;
        } else if (imageAspect < targetAspect) {
          // Image is taller than target
          sh = originalWidth / targetAspect;
          sy = (originalHeight - sh) / 2;
        }

        ctx.drawImage(image, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(null);

            const output = new File([blob], `${file.name.split(".")[0]}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            resolve(output);
          },
          "image/webp",
          100
        );
      };
    };
  });
}
