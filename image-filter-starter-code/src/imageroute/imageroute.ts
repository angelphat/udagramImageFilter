import { Router, Request, Response } from "express";
import { deleteLocalFiles, filterImageFromURL } from '../util/util';
import { requireAuth } from '../users/auth';


const router:Router = Router();

// Implement /filteredimage
//Response code 200 Filter Image Success
//Response code 400 image_url null or empty
//Response code 422 input image_url right but can't filter
router.get('/filteredimage',
requireAuth,
    async (req:Request, res:Response) =>{
    const {image_url} = req.query;
    if(!image_url || image_url.trim() === '') {
        return res.status(400).send({"filterError":"filteredimage is required"})
    }
    try{
        const myFilter = await filterImageFromURL(image_url);
        res.sendFile(myFilter);
        res.on('finish',() => deleteLocalFiles([myFilter]));
    }catch(error){
        res.status(422).send({"filterError":"Sorry! we can't filter this url:" + image_url});
    }
   
});

export const ImageRouter: Router = router;