import { Response } from 'express';
import { UserService } from "../services/user.service";
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const userService = new UserService();
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const accountId = req.account?.id;
        if (!accountId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const updated = await userService.updateProfile(accountId, req.body);
        res.status(200).json(updated);

    } catch (error: any) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
}

// export const getUser = async (req: Request, res: Response) => {
//   const id = parseInt(req.params.id, 10);

//   const user = await userService.getUserById(id);
  
//   if (!user) return res.status(404).json({ message: "User not found" });
  
//   return res.json(user);
// };