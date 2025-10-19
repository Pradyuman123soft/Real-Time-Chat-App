import  nextConnect from 'next-connect';

import multer, { diskStorage } from 'multer';
// const nextConnect = require('next-connect');
// const multer = require('multer');

// setup multer for file storage (this example saves locally)
const uplaod = multer({
    storage: multer.diskStorage({
        detination:(req, file, cb)=>{
            cb(null,'./public/uploads');
        },//destination folder for saving the uploaded files
        filename:(req, file, cb)=>{
            cb(null, `${Date.now()}-${file.originalname}`);//generate a unique file name
        },
    }),
    limits:{fileSize:2*1024*1024},//2 mb file size
});

// const apiRoute = nextConnect({
//     onError(error, req, res){
//         res.status(501).json({error: `Sorry, something went wrong: ${error.message}`});
//     },
//     onNoMatch(req, res){
//         res.status(405).json({error: `Method ${req.method} not allowed`});
//     },
// })

// apiRoute.use(uplaod.single('file')); //use multer to handle a single file upload

// apiRoute.post((req, res)=>{
//     // once the file is uploaded, send back the file path to the client
//     res.status(200).json({data:'File Uploaded successfully', file: req.file});
// });
// module.exports = apiRoute;


// export const config = {
//     api:{
//         bodyParser:false, //disable next.js body parser as we are using multer for parsing
//     },
// };

// create the API route
export async function POST(req) {
    try{
    const formData = await req.formData();
    const file = formData.get('croppedImage');

    const uploadHandler = uplaod.single('croppedImage');

    return new Promise((resolve, reject) => {
        uploadHandler(req, {}, (error)=>{
            if(error){
                console.error('Multer error', error); //log error
                
                return reject(new Response(`File upload failed: ${error.message}`,{status: 500}));
            }
            resolve(new Response(JSON.stringify({message:`File uploaded successfully`}),{status: 200}));
        });
    });
 }catch(error){
    console.error("General error:",error);
    return new Response(`Unexpected error: ${error.message}`,{status:500});
    
 }
}
export const config = {
    api:{
        bodyParser: false,
    },
};