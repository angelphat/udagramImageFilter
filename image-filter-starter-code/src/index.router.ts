import { Router } from 'express';
import { ImageRouter } from './imageroute/imageroute';
import { AuthRouter } from './users/auth';

const router: Router = Router();
//Auth API
router.use('/auth',AuthRouter);
//Image filter API
router.use('/image',ImageRouter);
export const IndexRouter: Router = router;