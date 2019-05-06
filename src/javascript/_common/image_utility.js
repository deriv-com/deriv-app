require('canvas-toBlob');

const compressImg = (image) => new Promise((resolve) => {
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (img.naturalWidth > 2560) {
            const width = 2560;
            const scaleFactor = width / img.naturalWidth;
            canvas.width = width;
            canvas.height = img.naturalHeight * scaleFactor;
        } else {
            canvas.height = img.naturalHeight;
            canvas.width = img.naturalWidth;
        }

        context.fillStyle = 'transparent';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.save();
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const filename = image.filename.replace(/\.[^/.]+$/, '.jpg');
            const file = new Blob([blob], {
                type: 'image/jpeg',
            });
            file.lastModifiedDate = Date.now();
            file.name = filename;
            resolve(file);
        }, 'image/jpeg', 0.9); // <----- set quality here

    };
});

const convertToBase64 = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        const result = { src: reader.result, filename: file.name };
        resolve(result);
    };
});

const isImageType = filename => (/\.(gif|jpg|jpeg|tiff|png)$/i).test(filename);

module.exports = {
    compressImg,
    convertToBase64,
    isImageType,
};
