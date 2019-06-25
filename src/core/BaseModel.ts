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
                return out;
            }
        };

        protected onPrepare() {}

        /**
         * 可重复调用的数据更新
         */
        abstract refresh(): Promise<any>;

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

        protected bindDataGet<T>(dataClass: common.IClass<T>, dataList: T[]) {
            //todo
            this.careData(dataClass, (msg) => {
                this.getDate(msg.data, dataList);
            })
        }
        protected removeDateGet(){}

        protected careData<T>(dataClass: common.IClass<T>, dealCall: (msg: Message<IGetData<T>>) => void) {
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