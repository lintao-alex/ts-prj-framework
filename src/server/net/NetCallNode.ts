/**
 * Created by lintao_alex on 2017/9/19.
 */
namespace Dream.frame {
    export interface INetCall {
        then(onFulfilled: (value: IResponseData, param?: IRequestParam) => void, thisObj?: any, onRejected?: (reason: any, param?: IRequestParam) => void);

        catch(onRejected: (reason: any, param?: IRequestParam) => void, thisObj?: any);
    }

    export interface INetResolve {
        response: IResponseData;
        param: IRequestParam;
    }

    /**
     * @internal
     */
    export class NetCallNode {
        private static _CREATE_CNT = 0;
        readonly id: number;
        command: string;
        param: IRequestParam;
        resolve: (value?: INetResolve) => void;
        reject: (reason?: any) => void;

        constructor() {
            this.id = ++NetCallNode._CREATE_CNT;
        }

        invokeResponse(response: IResponseData) {
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