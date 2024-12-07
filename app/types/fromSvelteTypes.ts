import { RequestEvent as InterfaceEvent} from '../interfaces/ResponsesRequests'
/** @@ testing from svelte @@ */

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
// @ts-ignore
type MatcherParam<M> = M extends (param : string) => param is infer U ? U extends string ? U : string : string;
type RouteParams = {  };
type RouteId = '/api/chat';


export type RequestEvent = InterfaceEvent<RouteParams, RouteId>;

export type RequestHandler<
    Params extends Partial<
        Record<string, string>
    > = Partial<
        Record<string, string>
    >,
    RouteId extends string | null = string | null
> = (
    event: InterfaceEvent<Params, RouteId>
) => Promise<Response> 
