import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput } from "./dtos/login.dto";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { Verification } from "./entities/varification.entity";
import { UserProfileOutput } from "./dtos/user-profile.dto";
import { VerifyEmailOutput } from "./dtos/verify-email.dto";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Verification) private readonly verificationRepository: Repository<Verification>,
        private readonly jwtService: JwtService
    ) {}
    
    /* ES6의 특징: {email, password, role}과 같은 방식으로 객체를 입력받을 수 있다. */
    async createAccount({email, password, role}: CreateAccountInput): Promise<{ ok: boolean, error?: string }> {
        try {
            // 이미 존재하는 email인지 확인: type ORM Version에 따라서 where을 명시적으로 적어줘야 함
            const exist = await this.userRepository.findOne({ where: { email } })
            if (exist) {
                return { ok: false, error: '해당 이메일을 가진 회원이 이미 존재합니다.' };
            }

            
            const user = await this.userRepository.save(this.userRepository.create({
                email, 
                password, 
                role
            }));

            await this.verificationRepository.save(this.verificationRepository.create({
                user: user // User와 OneToOne 관계 형성
            }))

            return { ok: true };
        } catch (e) {
            return { ok: false, error: '계정을 생성할 수 없습니다.' };
        }
    }

    async login({ email, password }: LoginInput): Promise<{ ok: boolean, error?: string, token?: string}> {
        try {
            const user = await this.userRepository.findOne({ 
                where: { email }, 
                select: ['password', 'id'] // password와 id는 확실하게 Select하겠다는 옵션 => password를 Entity에서 select: false 해줬기 때문에
            });

            if (!user) {
                return { ok: false, error: '존재하지 않는 유저입니다.' };
            }

            const isCollectPassword = await user.checkPassword(password);
            if (!isCollectPassword) {
                return { ok: false, error: '잘못된 비밀번호 입니다.' };
            }
            const token = this.jwtService.sign(user.id);
            
            return {
                ok: true,
                token: token
            }
        } catch (e) {
            return { ok: false, error: e};
        }
    }

    async findById(id: number): Promise<UserProfileOutput> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw Error();
            }

            return {
                ok: true,
                user: user
            }
        } catch (e) {
            return {
                ok: false,
                error: '유저를 찾을 수 없습니다.'
            }
        }
    }

    async editProfile(userId: number, { email, password }: EditProfileInput): Promise<EditProfileOutput> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (email) {
                user.email = email;
                user.verified = false;
                await this.verificationRepository.save(this.verificationRepository.create({
                    user: user
                }))
            }
            if (password) {
                user.password = password;
            }
            // update() 메서드를 사용하면 @BeforeUpdate를 호출시킬 수가 없다.
            // save() 메서드를 사용하면 기존 Entity는 udpate하고, 새로운 Entity는 insert 한다.
            await this.userRepository.save(user);

            return {
                ok: true
            }
        } catch (e) {
            return {
                ok: false,
                error: e
            }
        }
    }

    async verifyEmail(code: string): Promise<VerifyEmailOutput> {
        try {
            const verification = await this.verificationRepository.findOne({ where: { code: code }, relations: ['user'] });

            if (verification) {
                verification.user.verified = true;
                await this.userRepository.save(verification.user);
                await this.verificationRepository.delete(verification.id); // 인증이 끝난 verification은 DB에서 삭제
                
                return {
                    ok: true
                }
            }

            throw Error("존재하지 않는 Code 입니다. " + code);
        } catch (e) {
            return {
                ok: false,
                error: e
            }
        }
    }
}