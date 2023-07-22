import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";

@Injectable()
export class RestaurantService {

    constructor(@InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>) {}

    getAll(): Promise<Restaurant[]> {
        return this.restaurantRepository.find();
    }

    createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        const restaurant = this.restaurantRepository.create(createRestaurantDto);

        return this.restaurantRepository.save(restaurant);
    }
}