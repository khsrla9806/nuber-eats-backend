import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { type } from "os";

/* PickType은 원하는 필드들만 골라서 가져올 수 있다. */
@InputType()
export class CreateAccountInput extends PickType(User, ['email', 'password', 'role']) {
}

@ObjectType()
export class CreateAccountOutput {
    @Field(type => String, { nullable: true })
    error?: string;

    @Field(type => Boolean)
    ok: boolean;
}