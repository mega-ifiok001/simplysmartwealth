import { v2 as cloudinary } from "cloudinary";

export async function uploadCover(file: File) {
  if (file.size > 4 * 1024 * 1024) throw new Error("Cover image must be no larger than 4 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are supported.");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (!(jpeg || png || webp)) throw new Error("The uploaded file is not a supported image.");
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Image uploads are not configured. Contact the site administrator.");
  }
  cloudinary.config({ cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET, secure: true });
  return new Promise<{ coverUrl: string; coverPublicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: "simplysmartwealth/posts", resource_type: "image",
      allowed_formats: ["jpg", "png", "webp"],
      transformation: [{ width: 2000, height: 2000, crop: "limit" }],
    }, (error, result) => {
      if (error || !result) reject(new Error("Image upload failed. Please try again."));
      else resolve({ coverUrl: result.secure_url, coverPublicId: result.public_id });
    });
    stream.end(bytes);
  });
}
