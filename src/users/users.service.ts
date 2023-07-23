import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
    
    /* ES6의 특징: {email, password, role}과 같은 방식으로 객체를 입력받을 수 있다. */
    async createAccount({email, password, role}: CreateAccountInput): Promise<{ ok: boolean, error?: string }> {
        try {
            // 이미 존재하는 email인지 확인: type ORM Version에 따라서 where을 명시적으로 적어줘야 함
            const exist = await this.userRepository.findOne({ where: { email } })
            if (exist) {
                return { ok: false, error: '해당 이메일을 가진 회원이 이미 존재합니다.' };
            }

            const user = this.userRepository.create({email, password, role});
            await this.userRepository.save(user);

            return { ok: true };
        } catch (e) {
            return { ok: false, error: '계정을 생성할 수 없습니다.' };
        }
    }
}