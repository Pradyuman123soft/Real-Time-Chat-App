"use client"
import React , { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

import getCroppedImg from "./cropImage";
// utility function to crop the image
export default function ProfilePhotoUpload(){
  const [image, setImage] = useState(null);//for storing the selected image
  const [crop, setCrop] = useState({x:0, y:0})//store crop position(x,y)
  const [zoom, setZoom] = useState(1) //store zoom level
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); //store cropped area pixels data


  // handle the file selection from the input
  const handleFileChange = (event)=>{
    const file = event.target.files[0];
    //access the selected file from the input
    
    
    // generate a URL to display a preview of the selected image
    const fileURL = URL.createObjectURL(file);

    // set the image url in the state for cropping preview
    setImage(fileURL);
  };


// called when the cropping is done , stores the cropped area in pixels
const onCropComplete = useCallback(
  (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    // store the cropped area pixel value in state
  },[])



  const handleUpload= async()=>{
    try{
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      // get the cropped image as a blob
    const formData = new FormData();
    // create a FormData object to hold the image file
    formData.append('file',croppedImage);
    // append the  cropped image file to formdata

    //send the image to the backend using POST request
    const response = await fetch('/api/upload',{
      method: 'POST',
      body:formData,//pass the formData with the image file to the api
    }) ;

    if(response.ok){
      const data = await response.json();
      console.log('Image uploaded successfully',data.path);//display the server path of the uploaded image
    }
    else{
      console.error('Image upload failed');
    }
  }
  catch(error){
    console.error(error);
    
  }
}
  return(
    <div className='flex flex-col items-center'>
      
        <input 
        type="file"
        accept = "image/*"
        onChange = {handleFileChange}
        // triggered when the user selects a file
        className = 'mb-4'
        />
        {
          image && (
          <div className='relative w-64 h-64'>
            {/* image cropper */}
            <Cropper
            image = {image} //The image URL to be cropped
            crop = {crop} //current crop position
            zoom = {zoom} //current zoom position
            aspect = {1} //aspect ratio for cropping(1:1 for a square profile picture)
            onCropChange = {setCrop} //update the crop position
            onZoomChange = {setZoom} //update the zoom position
            onCropComplete = {onCropComplete}//triggered when cropping is completed
            />
          </div>
          )}
        {/* display the preview of the selected image */}
        <button
        onClick = {handleUpload} //trigger the upload process when cropping is completed
        className='bg-blue-500 text-white
        py-2 px-4 rounded hover:bg-blue-700'
        >
          Upload Profile Photo
        </button>
      
    </div>
  )

}
