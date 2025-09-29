import axios from "axios";
import React, { useState } from "react";

export default function UploadFile() {
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Vui lòng chọn ít nhất 1 file");
      return;
    }

    try {
      setIsUploading(true);

      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "re_academy");
        formData.append("cloud_name", "dycwr6ich");

        return axios
          .post("https://api.cloudinary.com/v1_1/dycwr6ich/image/upload", formData)
          .then((res) => res.data.secure_url);
      });

      const urls = await Promise.all(uploadPromises);
      setImages(urls);
      setFiles([]);

      console.log("Upload success:", urls);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {isUploading && <div className="loading">Đang tải...</div>}

      <h2>Upload nhiều ảnh</h2>

      {images.length > 0 && (
        <div>
          <h3>Ảnh đã upload:</h3>
          {images.map((url, index) => (
            <img
              key={index}
              height={150}
              width={200}
              src={url}
              alt={`Uploaded ${index + 1}`}
              style={{ margin: "5px" }}
            />
          ))}
        </div>
      )}

      <input type="file" multiple onChange={handleChangeFile} />
      <br />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
