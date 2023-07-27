import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';
import { Verification } from './entities/varification.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Verification])], // Repository 가져오기
    providers: [UserService, UserResolver],
    exports: [UserService] // UserService를 다른 곳에서 DI 받을 수 있도록 설정
})
export class UsersModule {}
