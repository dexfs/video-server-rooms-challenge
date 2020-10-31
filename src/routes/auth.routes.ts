import { Router } from 'express';
import { validate } from 'express-validation';

import IndexController from '@app/http/auth/controllers/IndexController';
import authValidation from '@app/http/requests/AuthRequest';

const authRouter = Router();

authRouter.post(
  '/',
  validate(authValidation, {}, {}),
  IndexController.authenticate,
);

authRouter.get(
  '/',
  function(req, res) {
    return res.json({data: 'ok'})
  }
);


export default authRouter;
