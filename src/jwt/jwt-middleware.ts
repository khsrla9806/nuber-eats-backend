import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtService } from "./jwt.service";
import { UserService } from "src/users/users.service";

/* Class를 사용해서 Middleware 만든기 */
@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if ('x-jwt' in req.headers) {
           const token = req.headers['x-jwt'];
           const decoded = this.jwtService.verify(token.toString());

           if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
                try {
                    const user = await this.userService.findById(decoded['id']);
                    req['user'] = user; // Request에 찾아낸 user 정보를 전달
                } catch (e) {
                    console.log(e);
                }
           }
        }

        next(); // Request, Response를 다음 Handler로 넘겨준다.
    }
}



/* Function을 사용해서 Middleware 만들기
    export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
        console.log(req.headers);
        next();
    }
    
*/