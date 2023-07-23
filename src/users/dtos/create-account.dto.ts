import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { type } from "os";
import { MutationOutput } from "src/common/dtos/output.dto";

/* PickType은 원하는 필드들만 골라서 가져올 수 있다. */
@InputType()
export class CreateAccountInput extends PickType(User, ['email', 'password', 'role']) {
}

@ObjectType()
export class CreateAccountOutput extends MutationOutput {}