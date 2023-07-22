import { Field, ObjectType } from "@nestjs/graphql";
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
    name: string;

    @Field(type => Boolean)
    @Column()
    isVegan: boolean;

    @Field(type => String)
    @Column()
    address: string;

    @Field(type => String)
    @Column()
    ownerName: string;

    @Field(type => String)
    @Column()
    categoryName: string;
}