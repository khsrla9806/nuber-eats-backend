import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthUser } from "src/auth/auth-user.decorator";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";

@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            return await this.userService.createAccount(createAccountInput);
        } catch (e) {
            return {
                ok: false,
                error: e
            }
        }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        try {
            return await this.userService.login(loginInput);
        } catch (e) {
            console.log(e);
            return { ok: false, error: e };
        }
    }

    @Query(returns => User)
    @UseGuards(AuthGuard) // 우리가 만든 AuthGuard를 me() 쿼리에 적용
    me(@AuthUser() authUser: User) {
        return authUser;
    }

    @Query(returns => UserProfileOutput)
    @UseGuards(AuthGuard)
    async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        try {
            const user = await this.userService.findById(userProfileInput.userId);
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

    @Mutation(returns => EditProfileOutput)
    @UseGuards(AuthGuard)
    async editProfile(
        @AuthUser() loginUser: User, 
        @Args('input') editProfileInput: EditProfileInput
    ): Promise<EditProfileOutput> {
        try {
            await this.userService.editProfile(loginUser.id, editProfileInput);

            return {
                ok: true
            }
        } catch (e) {
            return {
                ok: false,
                error: e
            }
        }
        return null;
    }

}