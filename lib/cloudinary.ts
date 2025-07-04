import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadImage = async (file: string, folder = "general") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `fundveritas/${folder}`,
      resource_type: "auto",
    })
    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw new Error("Failed to upload image")
  }
}

export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId)
    return { success: true }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    throw new Error("Failed to delete image")
  }
}

export default cloudinary
