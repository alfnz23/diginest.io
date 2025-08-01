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

// Image upload functions - converted from static class

// Upload image to Cloudinary
export async function uploadImage(
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
            public_id: fileName.split(".")[0],
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            resource_type: "image",
            quality: "auto",
            fetch_format: "auto",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else if (result) {
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
              });
            } else {
              reject(new Error("No result from Cloudinary"));
            }
          },
        )
        .end(fileBuffer);
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
}

// Delete image from Cloudinary
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return false;
  }
}

// Get image transformation URL
export function getTransformationUrl(
  publicId: string,
  transformations: Record<string, string | number> = {},
): string {
  try {
    return cloudinary.url(publicId, {
      transformation: transformations,
      secure: true,
    });
  } catch (error) {
    console.error("Error generating transformation URL:", error);
    return "";
  }
}

// Generate signed upload parameters for client-side uploads
export function generateUploadSignature(params: Record<string, string | number>): {
  signature: string;
  timestamp: number;
  api_key: string;
} {
  const timestamp = Math.round(Date.now() / 1000);

  const paramsWithTimestamp = {
    ...params,
    timestamp,
  };

  // Validate API secret is available
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    throw new Error("Missing required environment variable: CLOUDINARY_API_SECRET");
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsWithTimestamp,
    apiSecret,
  );

  return {
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY || "",
  };
}

export default cloudinary;
