/**
 * Created by lintao_alex on 2017/9/19.
 */
namespace Dream.frame {
    export interface INetResolve<T> {
        readonly response: T;
        readonly param: IRequestParam;
    }

    /**
     * @internal
     */
    export class NetCallNode<T> {
        private static _CREATE_CNT = 0;
        readonly id: number;
        command: string;
        param: IRequestParam;
        resolve: (value?: INetResolve<T>) => void;
        reject: (reason?: any) => void;

        constructor() {
            this.id = ++NetCallNode._CREATE_CNT;
        }

        invokeResponse(response: T) {
            this.resolve({ response, param: this.param });
        }

        errorResponse(reason: any) {
            this.reject(reason);
        }

        clear() {
            this.command = undefined;
            this.param = undefined;
            this.resolve = undefined;
            this.reject = undefined;
        }
    }
}