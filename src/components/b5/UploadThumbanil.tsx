import React, { useState } from "react";
import axios from "axios";

export default function UploadThumbnail() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // 🔑 thay bằng preset
    formData.append("cloud_name", "YOUR_CLOUD_NAME"); // 🔑 thay bằng cloud name

    try {
      setIsUploading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        formData
      );

      const secureUrl = res.data.secure_url;

      // Tạo thumbnail bằng cách chèn transformation
      // secureUrl có dạng: https://res.cloudinary.com/.../upload/vxxx/filename.jpg
      const thumbUrl = secureUrl.replace(
        "/upload/",
        "/upload/w_150,h_150,c_fill/"
      );

      setOriginalUrl(secureUrl);
      setThumbnailUrl(thumbUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload ảnh & tạo thumbnail</h2>
      <input type="file" onChange={handleChangeFile} />
      <br />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Đang upload..." : "Upload"}
      </button>

      {thumbnailUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Thumbnail:</h3>
          <img
            src={thumbnailUrl}
            alt="thumbnail"
            style={{ cursor: "pointer", border: "1px solid #ccc" }}
            onClick={() => window.open(originalUrl, "_blank")}
          />
          <p>👉 Click thumbnail để mở ảnh gốc</p>
        </div>
      )}
    </div>
  );
}
