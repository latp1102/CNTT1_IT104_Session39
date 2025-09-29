import React, { useState } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";

export default function UploadCompressFile() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Hàm nén ảnh
  const resizeFile = (file: File) =>
    new Promise<File | Blob>((resolve) => {
      Resizer.imageFileResizer(
        file,
        800, // chiều rộng tối đa
        800, // chiều cao tối đa
        "JPEG", // định dạng
        80, // chất lượng (0-100)
        0, // rotation
        (uri) => {
          resolve(uri as File | Blob);
        },
        "blob" // xuất ra Blob
      );
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn ảnh trước!");
      return;
    }
    try {
      setIsUploading(true);

      // compress ảnh
      const compressedFile = (await resizeFile(file)) as Blob;

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // 🔑 thay bằng preset của bạn
      formData.append("cloud_name", "YOUR_CLOUD_NAME"); // 🔑 thay bằng cloud name

      // upload lên Cloudinary
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        formData
      );

      setImageUrl(res.data.secure_url);
      alert("Upload thành công!");
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload ảnh với compress</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Đang upload..." : "Upload"}
      </button>
      {imageUrl && (
        <div>
          <h3>Ảnh sau khi nén & upload:</h3>
          <img src={imageUrl} alt="uploaded" style={{ maxWidth: "400px" }} />
        </div>
      )}
    </div>
  );
}
