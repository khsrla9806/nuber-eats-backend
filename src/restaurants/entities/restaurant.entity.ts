import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { options } from "joi";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@ObjectType()
@Entity()
export class Restaurant {
    @Field(type => Number)
    @PrimaryGeneratedColumn("identity")
    id: number;

    @Field(type => String)
    @Column()
    @IsString()
    @Length(5, 10)
    name: string;

    @Field(type => Boolean, { defaultValue: false }) // GraphQL의 스키마에 default 값이 false
    @Column({ default: false }) // DB에서 default 값이 false
    @IsOptional()
    @IsBoolean()
    isVegan: boolean;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsString()
    @Length(5, 10)
    ownerName: string;

    @Field(type => String)
    @Column()
    @IsString()
    categoryName: string;
}