import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { IsEmail, IsEnum } from "class-validator";

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
    @IsEmail()
    @Column()
    email: string;

    @Field(type => String)
    @Column()
    password: string;

    @Field(type => UserRole) // GraphQL에 등록한 enum을 @Field의 type으로 지정
    @IsEnum(UserRole)
    @Column({type: 'enum', enum: UserRole})
    role: UserRole;

    /* DB에 Insert 되기 전에 비밀번호를 해싱해서 넣는다. (round = 10, 총 10번 진행해라) */
    @BeforeInsert()
    async hashPassword(): Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password, 10); // 두 번째 인자가 round 값 (bcrypt 추천 값)
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}