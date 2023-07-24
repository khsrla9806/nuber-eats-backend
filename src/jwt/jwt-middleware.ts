import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

/* Function을 사용해서 Middleware 만들기 */
export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    next();
}



/* Class를 사용해서 Middleware 만든기
    export class JwtMiddleware implements NestMiddleware {
        use(req: Request, res: Response, next: NextFunction) {
            console.log(req.headers);
            next();
        }
    }
*/