/**
 * Created by lintao_alex on 2019/6/20
 */
namespace Dream.frame {
    export class BaseUIAnimation implements common.IClear{
        protected _view: UIViewType;
        reset(view: UIViewType) {
            this._view = view;
        }
        start(cmpCall:()=>void, thisObj: any){
            cmpCall.call(thisObj);
        }
        clear(): void {
            this._view = null;
        }
    }
}