
import * as jwt from 'jsonwebtoken';

import { User } from './model/User';
import { NextFunction} from 'connect';
import { Router, Request, Response } from 'express';
import { config } from '../config/config';


const router:Router = Router();
//Implement method generate token from user info
//Response token
function generateJWT(user: User): string {
    return jwt.sign(JSON.stringify(user), config.jwt.secret);
}

//Implement API Login
// user can input anything ...without empty 
//Response 200 return token
//Response 400 email/password is empty
router.post('/login',async (req:Request, res:Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email) {
        return res.status(400).send({auth:false, message: 'Please input email'});
    }
    if(!password) {
        return res.status(400).send({auth:false, message:' Please input password'});
    }
    const user:User  = {
        email:email,
        password: password
    };

    const resultToken = generateJWT(user);
    res.status(200).send({auth: true,token:resultToken});
    
})

//Implement Method check token
//Response code 401 if token is empty or can't slipt 
//Response code 500 if token is not right
export function requireAuth(req: Request, res: Response, next: NextFunction) {
   
    if (!req.headers || !req.headers.authorization){
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    

    const token_bearer = req.headers.authorization.split(' ');
    if(token_bearer.length != 2){
        return res.status(401).send({ message: 'Malformed token.' });
    }
    
    const token = token_bearer[1];
    console.log("my token",token);
    return jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate' });
      }
      return next();
    });
}

export const AuthRouter:Router = router;