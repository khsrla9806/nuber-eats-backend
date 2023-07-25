import { InputType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/output.dto";
import { User } from "../entities/user.entity";

@InputType()
export class EditProfileInput extends PartialType( // (2) PickType으로 가져온 모든 필드를 PartialType을 통해 nullable = true
    PickType(User, ['email', 'password']) // (1) email, password를 PickType으로 가져오면 nullable = false
) {}

@ObjectType()
export class EditProfileOutput extends CommonOutput {}