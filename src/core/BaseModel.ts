///<reference path="ProxyObserver.ts"/>
/**
 * Created by lintao_alex on 2019/6/14
 */

namespace Dream.frame {
    export abstract class BaseModel extends ProxyObserver implements common.IDispose {
        private _hasPrepared = false;
        private _dataGetActionList = new Array<(msg: Message<any>)=>void>();

        /**
         * 可重复调用的数据更新
         */
        abstract refresh(): Promise<any>;
        protected onPrepare() {}

        /**
         * 准备必要数据
         */
        async prepare(): Promise<any> {
            if (this._hasPrepared) {
                return this.fulfilled;
            } else {
                this.onPrepare();
                let out = this.refresh();
                await out;
                this._hasPrepared = true;
                return out;
            }
        };


        getDate(container: Dream.frame.IGetData<any>, list: Array<any>) {
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

        protected careDataGet(voClass: common.IClass<BaseVO>, dataList: BaseVO[]) {
            let dealCall = this.createDataGetDealCall(dataList);
            this._dataGetActionList.push(dealCall);
            this.care(DataMessage.GET, dealCall, this, DataUtils.getDataFilter(voClass));
        }
        private createDataGetDealCall(dataList: BaseVO[]){
            return (msg:Message<any>) => this.getDate(msg.data, dataList);
        }


        protected getServer<T extends BaseServer>(key: new() => T): T {
            return $internal.ServerCenter.Ins.getServer(key);
        }

        protected get fulfilled() {
            return fulfilledPromise;
        }

        dispose(): void {
            let actList = this._dataGetActionList;
            for(let i = actList.length - 1; i >= 0; i--){
                let act = actList[i];
                this.abandon(DataMessage.GET, act, this);
            }
            actList.length = 0;
            this._dataGetActionList = null;
        }
    }

    export interface IModelClass {
        new(): BaseModel;
    }
}