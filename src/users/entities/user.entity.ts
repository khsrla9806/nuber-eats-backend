import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { type } from "os";
import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";

enum UserRole {
    Client,
    Owner,
    Delivery
}

/* GrahpQL에도 Enum을 등록할 수 있다. */
registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {

    @Field(type => String)
    @Column()
    email: string;

    @Field(type => String)
    @Column()
    password: string;

    @Field(type => UserRole) // GraphQL에 등록한 enum을 @Field의 type으로 지정
    @Column({type: 'enum', enum: UserRole})
    role: UserRole;
}