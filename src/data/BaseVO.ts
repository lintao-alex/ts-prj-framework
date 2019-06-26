/**
 * Created by lintao_alex on 2019/6/22
 * 此类对象不必考虑回收复用,子类只需重写destroy方法即可
 */
namespace Dream.frame {
    export class BaseVO<T> extends BaseData implements common.IDispose{
        protected _scData: T;
        private _hasDisposed = false;

        $updateSc(value: T) {
            let hasChange = false;
            if (this._scData) {
                hasChange = true;//这里简化了思路，大概率有后端推送的更新时都是有变化的（期望后端不做全量推送）
            }
            this._scData = value;
            if (hasChange) this.noticeWatcher();
        }
        /**
         * @final
         */
        dispose():void{
            if(this._hasDisposed) return;
            this.clear();
            this.destroy();
            this._scData = undefined;
            this._hasDisposed = true;
        }

        protected destroy(){}
    }
}