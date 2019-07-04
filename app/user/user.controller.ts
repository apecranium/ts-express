import { Controller } from '@app/shared/controller';
import { UserData, UserService } from '@app/user';
import { Router } from 'express';

export class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.router.route(this.path)
      .get(async (req, res, next) => {
        try {
          const users = await this.userService.getUsers();
          res.json(users);
        } catch (err) {
          next(err);
        }
      })
      .post(async (req, res, next) => {
        try {
          const user = await this.userService.createUser(new UserData(req.body.email, req.body.name));
          res.status(201).json(user);
        } catch (err) {
          next(err);
        }
      });

    this.router.route(`${this.path}/:id`)
      .get(async (req, res, next) => {
        try {
          const user = await this.userService.getUser(req.params.id);
          res.json(user);
        } catch (err) {
          next(err);
        }
      })
      .put(async (req, res, next) => {
        try {
          const user = await this.userService.updateUser(new UserData(req.body.email, req.body.name, req.params.id));
          res.json(user);
        } catch (err) {
          next(err);
        }
      })
      .delete(async (req, res, next) => {
        try {
          await this.userService.deleteUser(req.params.id);
          res.json({ message: `User ${req.params.id} deleted.` });
        } catch (err) {
          next(err);
        }
      });
  }
}
