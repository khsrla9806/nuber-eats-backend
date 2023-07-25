import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

/* Guard를 하나 생성 */
@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        
        // context가 현재는 Http로 되어있기 때문에 GraphQLContext로 변경
        const graphqlContext = GqlExecutionContext.create(context).getContext();

        const user = graphqlContext['user'];

        // user가 Request에 존재하지 않으면 다음으로 넘어가지 못하도록 false 반환
        if (!user) {
            return false;
        }

        // user가 Request에 존재한다면 AuthGuard는 통과해서 다음으로 넘어가도록 true 반환
        return true;
    }
}