import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

class TokenService {
  generate(subject: object): string {
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({user: subject}, secret, {
      expiresIn,
    });

    return token;
  }
}

export default TokenService;
