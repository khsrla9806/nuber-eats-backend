import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';

@Module({
    providers:[RestaurantResolver],
    imports: [TypeOrmModule.forFeature([Restaurant])], // forFeature()을 통해서 Repository 등록
})
export class RestaurantsModule {}
