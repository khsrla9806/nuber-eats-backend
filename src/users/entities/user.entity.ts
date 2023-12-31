import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
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
    @Column({ select: false })
    password: string;

    @Field(type => UserRole) // GraphQL에 등록한 enum을 @Field의 type으로 지정
    @IsEnum(UserRole)
    @Column({type: 'enum', enum: UserRole})
    role: UserRole;

    @Column({ default: false })
    @Field(type => Boolean)
    verified: boolean

    /* DB에 Insert 되기 전에 비밀번호를 해싱해서 넣는다. (round = 10, 총 10번 진행해라) */
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10); // 두 번째 인자가 round 값 (bcrypt 추천 값)
            } catch (e) {
                console.log(e);
                throw new InternalServerErrorException();
            }
        }
    }

    /* 로그인 시 입력받은 비밀번호를 Hash해서 현재 유저의 비밀번호와 동일한지 확인 */
    async checkPassword(inputPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(inputPassword, this.password);
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}