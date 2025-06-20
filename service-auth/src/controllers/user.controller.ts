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