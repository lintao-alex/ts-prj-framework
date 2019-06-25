/**
 * Created by lintao_alex on 2019/6/22
 * 此类对象不必考虑回收复用,子类只需重写destroy方法即可
 */
namespace Dream.frame {
    export class BaseVO extends BaseData implements common.IDispose{
        private _hasDisposed = false;

        /**
         * @final
         */
        dispose():void{
            if(this._hasDisposed) return;
            this.destroy();
            this._hasDisposed = true;
        }

        protected destroy(){}
    }
}