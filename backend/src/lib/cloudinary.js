import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
    cloud_name: "dv0yscnct", 
    api_key: "261695339612612", 
    api_secret: "r3c4pLGX_9zOJkeJfru8CaB7ohY"
  });

const uploadOnCloudinary = async (localFilePath) => {
    
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        // fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        // fs.unlinkSync(localFilePath)
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
    
}

  const deleteImageFromCloudinary = async (publicUrl) => {
    try {
      const publicId = publicUrl.split(".")[2].split("/").slice(5).join("/");
      cloudinary.api
        .delete_resources([publicId])
        .then((result) => {
          return result;
        })
        .catch((error) => {
          console.log(`Error 1 while deleting files ${error}`);
          return null;
        });
    } catch (error) {
      console.log(`Error 2 while deleting files ${error}`);
      return null;
    }
  };


export {uploadOnCloudinary, deleteImageFromCloudinary};