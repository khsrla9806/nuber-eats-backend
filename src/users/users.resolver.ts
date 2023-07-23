import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";

@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            const { ok, error } = await this.userService.createAccount(createAccountInput);

            return {
                ok: ok,
                error: error
            }
        } catch (e) {
            return {
                ok: false,
                error: e
            }
        }
    }
}