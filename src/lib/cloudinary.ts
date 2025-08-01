import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export class ImageUploadService {
  // Upload image to Cloudinary
  static async uploadImage(
    fileBuffer: Buffer,
    fileName: string,
    folder = "diginest-products",
  ): Promise<CloudinaryUploadResult | null> {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              public_id: fileName,
              resource_type: "image",
              format: "webp", // Convert to WebP for better compression
              quality: "auto",
              fetch_format: "auto",
              transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else if (result) {
                resolve(result as CloudinaryUploadResult);
              } else {
                reject(new Error("No result from Cloudinary"));
              }
            },
          )
          .end(fileBuffer);
      });
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  }

  // Delete image from Cloudinary
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error) {
      console.error("Error deleting image:", error);
      return false;
    }
  }

  // Generate optimized image URL
  static getOptimizedImageUrl(
    publicId: string,
    width?: number,
    height?: number,
    quality = "auto",
  ): string {
    const transformations = [`q_${quality}`, "f_auto"];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);

    return cloudinary.url(publicId, {
      transformation: transformations,
    });
  }

  // Get image upload signature (for direct uploads from frontend)
  static getUploadSignature(folder = "diginest-products") {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = {
      timestamp,
      folder,
      quality: "auto",
      fetch_format: "auto",
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!,
    );

    return {
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      folder,
    };
  }
}

export default cloudinary;
