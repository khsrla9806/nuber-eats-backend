import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as Joi from 'joi'; // Joi는 Javascript로 되어있기 때문에 import 방법이 다름
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt-middleware';
import { Verification } from './users/entities/varification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 우리 애플레케이션 어디서든 ConfigModule에 접근이 가능하도록 설정
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // prod 상태에서는 env 파일을 사용해서 하지 않음
      validationSchema: Joi.object({ // Joi 라이브러리를 이용하여 환경변수에 대한 유효성 검사를 진행할 수 있음
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(), // JWT 토큰을 생성할 때 필요한 Private Key
      }),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT, // +를 붙여서 string -> number 변경
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod', // DB와 Nest 모듈의 동기화: 개발, 테스트에서만 true 유지
      logging: process.env.NODE_ENV !== 'prod', // 콘솔에 데이터베이스 관련 부분을 찍음: 개발, 테스트에서만 true 유지
      entities: [Restaurant, User, Verification]
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({req}) => ({ user: req['user'] }) // Request 객체에 있는 'user'를 GraphQL에서 사용할 수 있도록 설정
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    /* 요청이 들어왔을 때 지나가는 Middleware를 AppModule에서 등록 */
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql', // 모든 Route 경로에서 오는 요청을 허용
      method: RequestMethod.POST // GraphQL은 내부적으로 모든 요청을 POST로 보냅니다.
    });


    /*
      consumer.apply(jwtMiddleware).exclude({
        path: '/api',
        method: RequestMethod.ALL
      })
    */
  }
}
