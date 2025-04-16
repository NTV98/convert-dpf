import { Request } from 'express';
import JwtUser from './user.model';

interface RequestWithUser extends Request {
  user: JwtUser;
}

export default RequestWithUser;
