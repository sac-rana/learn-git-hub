function compressImage(inputImage, quality, maxWidth, maxHeight, format) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Calculate the new dimensions while maintaining aspect ratio
      if (maxWidth && width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }

      if (maxHeight && height > maxHeight) {
        const ratio = maxHeight / height;
        height = maxHeight;
        width = width * ratio;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Convert the compressed image to the specified format
      const compressedImageData = canvas.toDataURL(
        `image/${format}`,
        quality / 100
      );
      const byteCharacters = atob(compressedImageData.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: `image/${format}` });
      resolve(blob);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = URL.createObjectURL(inputImage);
  });
}
