import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModuleOptions } from './jwt-interfaces';
import { CONFIG_OPTIONS } from './jwt-contant';

@Module({})
@Global() // 전역적으로 이 모듈을 사용할 수 있게 isGlobal: true 설정해주는 데코레이터
export class JwtModule {

    static forRoot(options: JwtModuleOptions): DynamicModule {
        return {
            module: JwtModule,
            exports: [JwtService],
            providers: [
                /* JwtService에서 options을 사용하기 위한 설정 */
                {
                    provide: CONFIG_OPTIONS, // 상수로 정의
                    useValue: options // options를 쓸건데 @Injects('CONFIG_OPTIONS')로 사용이 가능하도록
                },
                JwtService
            ]
        }
    }
}

/*
    providers의 JwtService는 아래에 있는 코드의 함축 형태이다.
    {
        provide: JwtService,
        useClass: JwtService
    }
*/