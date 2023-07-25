import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const AuthUser = createParamDecorator(
    // decorator에는 factory 메서드를 선언해야 한다.
    (data: unknown, context: ExecutionContext) => {
        const graphqlContext = GqlExecutionContext.create(context).getContext();
        const user = graphqlContext['user'];

        return user;
    }
)