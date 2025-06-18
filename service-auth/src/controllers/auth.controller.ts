import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body.email, req.body.password);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const token = await authService.login(req.body.email, req.body.password);
    res.status(200).json({
      token: token
    });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};