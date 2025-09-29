import axios from "axios";
import React, { useState } from "react";

export default function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [uploadDesc, setUploadDesc] = useState<string>("");
  const [deleteToken, setDeleteToken] = useState<string>(""); // token xoá
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn file");
      return;
    }
    if (!description) {
      alert("Vui lòng nhập mô tả ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "re_academy"); 
    formData.append("cloud_name", "dycwr6ich");
    formData.append("context", `alt=${description}`);

    try {
      setIsUploading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dycwr6ich/image/upload",
        formData
      );

      if (response.status === 200) {
        setImage(response.data.secure_url);
        setUploadDesc(description);
        setDeleteToken(response.data.delete_token); // lưu delete_token
        setDescription("");
        setFile(null);
      }

      console.log("Upload success:", response.data);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteToken) {
      alert("Không tìm thấy delete_token");
      return;
    }
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dycwr6ich/delete_by_token`,
        { token: deleteToken }
      );
      console.log("Delete result:", res.data);

      // reset state sau khi xoá
      setImage("");
      setUploadDesc("");
      setDeleteToken("");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div>
      {isUploading && <div className="loading">Đang tải...</div>}
      <h2>Upload ảnh và mô tả ảnh</h2>

      {image && (
        <div>
          <img height={200} width={300} src={image} alt={uploadDesc} />
          <p>
            <b>Mô tả:</b> {uploadDesc}
          </p>
          <button onClick={handleDelete}>Xoá ảnh</button>
        </div>
      )}

      <input type="file" onChange={handleChangeFile} />
      <br />
      <input
        type="text"
        placeholder="Nhập mô tả ảnh"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
