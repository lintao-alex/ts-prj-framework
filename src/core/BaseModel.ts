///<reference path="ProxyObserver.ts"/>
/**
 * Created by lintao_alex on 2019/6/14
 */

namespace Dream.frame {
    export abstract class BaseModel extends ProxyObserver implements common.IDispose {
        private _hasPrepared = false;

        /**
         * 准备必要数据
         */
        async prepare(): Promise<any> {
            if (this._hasPrepared) {
                return this.fulfiled;
            } else {
                this.onPrepare();
                let out = this.refresh();
                await out;
                this._hasPrepared = true;
                this.initDataObserver();
                return out;
            }
        };

        protected onPrepare() {}

        /**
         * 可重复调用的数据更新
         */
        abstract refresh(): Promise<any>;

        protected initDataObserver() {}

        dispose(): void {}

        getDate<T>(container: Dream.frame.IGetData<T>, list: Array<T>) {
            let describe = container.describe;
            if (describe.check) {
                if (container.onlyOne) {
                    container.result = [Dream.common.ArrayUtils.find(list, describe.check, describe.thisObj)];
                } else {
                    container.result = list.filter(describe.check, describe.thisObj);
                }
            } else {
                container.result = list;
            }
        }


        protected careData<U, T extends IGetData<U>>(dataClass: common.IClass<U>, dealCall: (msg: Message<IGetData<U>>) => void) {
            this.care(DataMessage.GET, dealCall, this, data => data.describe.dataClass == dataClass);
        }

        protected getServer<T extends BaseServer>(key: new() => T): T {
            return $internal.ServerCenter.Ins.getServer(key);
        }

        protected get fulfiled() {
            return fulfilledPromise;
        }
    }

    export interface IModelClass {
        new(): BaseModel;
    }
}