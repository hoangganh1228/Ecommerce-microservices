import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";

export class UserService {
    private userRepo = AppDataSource.getRepository(User);

    async updateProfile(accountId: number, data: Partial<User>) {
        let user = await this.userRepo.findOne({ where: { accountId } });
        if(!user) {
            user = this.userRepo.create({ accountId, ...data });
        } else {
            Object.assign(user, {
                fullName: data.fullName ?? user.fullName,
                phone: data.phone ?? user.phone,
                gender: data.gender ?? user.gender,
                birthday: data.birthday ?? user.birthday,
                avatar: data.avatar ?? user.avatar,
            });
        }

        return this.userRepo.save(user);
    }
}