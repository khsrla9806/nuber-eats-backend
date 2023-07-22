import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dtos/update-restaurant.dto";
import { NotFoundError } from "rxjs";

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

    async updateRestaurant({id, data}: UpdateRestaurantDto) {
        /* id로 Restaurant를 찾아서 없으면 BadRequestException을 던짐 */
        const foundedRestaurant = await this.restaurantRepository.findOneBy({id});
        if (!foundedRestaurant) {
            throw new BadRequestException(id + '에 해당하는 식당이 존재하지 않습니다.');
        }
        /*
            id로 해당하는 Entity를 찾고, 수정 사항이 있는 data를 적용한다.
            여기서 주의해야할 부분은 update는 id에 해당하는 Entity가 없어도 에러를 발생시키지 않는다.
        */
        this.restaurantRepository.update(id, {...data});
    }
}