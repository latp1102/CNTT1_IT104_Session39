import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import axios from "axios";

export default function UploadCropFile() {
  const [image, setImage] = useState<string>(""); // ảnh preview ban đầu
  const [croppedImage, setCroppedImage] = useState<string>(""); // ảnh crop để hiển thị
  const [uploadedUrl, setUploadedUrl] = useState<string>(""); // link Cloudinary
  const [isUploading, setIsUploading] = useState(false);

  const cropperRef = useRef<Cropper>(null);

  // chọn file từ input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // crop ảnh ra base64
  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({
        width: 400, // resize theo nhu cầu
        height: 400,
      });
      setCroppedImage(canvas.toDataURL("image/jpeg"));
    }
  };

  // upload ảnh crop lên Cloudinary
  const handleUpload = async () => {
    if (!croppedImage) {
      alert("Bạn chưa crop ảnh!");
      return;
    }

    const formData = new FormData();
    // chuyển base64 thành blob
    const blob = await fetch(croppedImage).then((res) => res.blob());
    formData.append("file", blob);
    formData.append("upload_preset", "re_academy"); // preset unsigned
    formData.append("cloud_name", "dycwr6ich");

    try {
      setIsUploading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dycwr6ich/image/upload",
        formData
      );
      setUploadedUrl(res.data.secure_url);
      console.log("Upload thành công:", res.data);
    } catch (err) {
      console.error("Upload lỗi:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload + Crop ảnh</h2>

      <input type="file" onChange={handleFileChange} />
      <br />

      {image && (
        <div style={{ width: "400px", margin: "20px auto" }}>
          <Cropper
            src={image}
            style={{ height: 400, width: "100%" }}
            aspectRatio={1} // tỉ lệ (1:1 = vuông, 16:9, v.v.)
            guides={true}
            ref={cropperRef}
            viewMode={1}
          />
          <button onClick={handleCrop} style={{ marginTop: "10px" }}>
            Crop ảnh
          </button>
        </div>
      )}

      {croppedImage && (
        <div>
          <h3>Ảnh đã crop:</h3>
          <img src={croppedImage} alt="cropped" style={{ maxWidth: "300px" }} />
        </div>
      )}

      {croppedImage && (
        <button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Đang upload..." : "Upload ảnh đã crop"}
        </button>
      )}

      {uploadedUrl && (
        <div>
          <h3>Ảnh đã upload lên Cloudinary:</h3>
          <img src={uploadedUrl} alt="uploaded" style={{ maxWidth: "300px" }} />
        </div>
      )}
    </div>
  );
}
