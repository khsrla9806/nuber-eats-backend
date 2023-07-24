import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Module({})
@Global() // 전역적으로 이 모듈을 사용할 수 있게 isGlobal: true 설정해주는 데코레이터
export class JwtModule {

    static forRoot(): DynamicModule {
        return {
            module: JwtModule,
            exports: [JwtService],
            providers: [JwtService]
        }
    }
}
