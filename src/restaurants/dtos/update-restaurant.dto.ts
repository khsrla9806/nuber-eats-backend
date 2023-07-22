import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateRestaurantDto } from "./create-restaurant.dto";

/* PartialType을 사용하면 CreateRestaurantDto의 모든 필드를 가져오지만, 모두 optional이다. */
@InputType()
class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto) {}

@InputType()
export class UpdateRestaurantDto {
    @Field(type => Number)
    id: number;

    @Field(type => UpdateRestaurantInputType)
    data: UpdateRestaurantInputType;
}