/**
 * Created by lintao_alex on 2019/6/14
 */


namespace Dream.frame {
    import BackCallList = Dream.common.BackCallList;
    import ObjectPool = Dream.common.ObjectPool;

    export abstract class BaseData implements common.IClear {
        private _watchList: BackCallList<(data: BaseData) => void>;

        watch(backCall: (data: BaseData) => void, thisObj: any) {
            let list = this._watchList;
            if (!list) {
                list = <any>ObjectPool.getObj(BackCallList)
                this._watchList = list;
            }
            list.addCall(backCall, thisObj);
        }

        unWatch(backCall: (data: BaseData) => void, thisObj: any) {
            if (this._watchList) {
                this._watchList.removeCall(backCall, thisObj);
            }
        }

        clear(): void {
            let list = this._watchList;
            if (list) {
                ObjectPool.recycleObj(list);
                this._watchList = null;
            }
        }

        protected noticeWatcher() {
            if (this._watchList) {
                this._watchList.invoke(this);
            }
        }
    }
}