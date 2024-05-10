document.getElementById("file-input").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const originalImage = document.getElementById("original-image");
      originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("compress-btn").addEventListener("click", function () {
  const fileInput = document.getElementById("file-input");
  const widthInput = document.getElementById("width-input").value;
  const heightInput = document.getElementById("height-input").value;
  const file = fileInput.files[0];

  if (file) {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: parseInt(widthInput, 10) || Infinity,
      maxHeight: parseInt(heightInput, 10) || Infinity,
      success(result) {
        const compressedImage = document.getElementById("compressed-image");
        compressedImage.src = URL.createObjectURL(result);

        document
          .getElementById("download-json-btn")
          .addEventListener("click", function () {
            const metadata = {
              description: document.getElementById("description").value,
              link: document.getElementById("link").value,
              originalSize: file.size,
              compressedSize: result.size,
            };
            const blob = new Blob([JSON.stringify(metadata, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "metadata.json";
            a.click();
          });
      },
      error(err) {
        console.error(err.message);
        alert("Error compressing the image.");
      },
    });
  }
});
