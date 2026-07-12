import { usersController } from '../controller/users.controller.js';
import { Router } from 'express';

const router = Router();

router.route('/').get(usersController.findAll).post(usersController.create);

export const UserRoutes = router;
