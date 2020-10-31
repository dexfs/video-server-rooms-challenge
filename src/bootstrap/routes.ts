import { Router } from 'express';

import authRoutes from './../routes/auth.routes';
import usersRoutes from './../routes/users.routes';
import roomsRoutes from './../routes/rooms.route';

const routes = Router();

routes.use('/authenticate', authRoutes);
routes.use('/users', usersRoutes);
routes.use('/rooms', roomsRoutes);

export default routes;
