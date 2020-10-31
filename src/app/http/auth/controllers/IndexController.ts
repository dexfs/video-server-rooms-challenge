import { Request, Response } from 'express';
import AuthenticateAction from '@app/actions/AuthenticateAction';

class IndexController {
  static async authenticate(request: Request, response: Response) {
    const authenticateAction = new AuthenticateAction();
    const { token } = await authenticateAction.execute(request.body);
    return response.json({ token });
  }
}

export default IndexController;
