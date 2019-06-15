/**
 * Created by lintao_alex on 2017/9/19.
 */
namespace Dream.frame {
    export interface INetCall {
        then(onFulfilled: (value: IResponseData, param?: IRequestParam) => void, thisObj?: any, onRejected?: (reason: any, param?: IRequestParam) => void);

        catch(onRejected: (reason: any, param?: IRequestParam) => void, thisObj?: any);
    }

    export class NetCallNode implements common.IClear, INetCall {
        private static _CREATE_CNT = 0;
        readonly id: number;
        command: string;

        private _param: IRequestParam;
        private _onFulFiled: (value: IResponseData, param?: IRequestParam) => void;
        private _thisObj: any;
        private _onReject: (reason: any, param?: IRequestParam) => void;

        constructor() {
            this.id = ++NetCallNode._CREATE_CNT;
        }

        reset(param: IRequestParam) {
            this._param = param;
        }

        invokeResponse(response: any) {
            this.onInvokeResponse(response);
            if (this._onFulFiled) {
                this._onFulFiled.call(this._thisObj, response, this._param);
            }
        }

        errorResponse(err: any) {
            if (this._onReject) {
                this._onReject.call(this._thisObj, err);
            }
        }

        clear() {
            this.command = null;
            this._param = null;
            this._thisObj = null;
            this._onFulFiled = null;
            this._onReject = null;
        }

        then(onFulfilled: (value: IResponseData, param?: IRequestParam) => void, thisObj?: any, onRejected?: (reason: any, param?: IRequestParam) => void) {
            this._thisObj = thisObj;
            this._onFulFiled = onFulfilled;
            if (onRejected) {
                this._onReject = onRejected;
            }
        }

        catch(onRejected: (reason: any, param?: IRequestParam) => void, thisObj?: any) {
            this._onReject = onRejected;
            this._thisObj = thisObj;
        }

        get param(): IRequestParam {
            return this._param;
        }

        protected onInvokeResponse(response: any) {}
    }
}