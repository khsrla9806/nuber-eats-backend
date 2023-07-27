import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { v4 as uuidv4 } from 'uuid';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
    
    @Column()
    @Field(type => String)
    code: string;

    @OneToOne(type => User, { onDelete: "CASCADE"}) // 관련된 User가 삭제되면 Verification도 같이 삭제
    @JoinColumn()
    user: User;

    @BeforeInsert()
    createCode(): void {
        this.code = uuidv4(); // Code는 Hook를 걸어서 랜덤으로 생성하도록 설정
    }
}