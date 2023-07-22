import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { IsBoolean, IsString, Length } from "class-validator";
import { Restaurant } from "../entities/restaurant.entity";

/* OmitType을 이용하여 'id' 필드만 제외한 나머지 필드를 Restaurant에서 가져와 DTO를 만든다. */
@InputType()
export class CreateRestaurantDto extends OmitType(Restaurant, ['id'], InputType) {
}