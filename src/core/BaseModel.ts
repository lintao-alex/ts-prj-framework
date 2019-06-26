///<reference path="ProxyObserver.ts"/>
/**
 * Created by lintao_alex on 2019/6/14
 */

namespace Dream.frame {
    import IClass = Dream.common.IClass;
    import IDispose = Dream.common.IDispose;

    type DataClass = BaseVO<any>;
    export abstract class BaseModel extends ProxyObserver implements IDispose {
        private _hasPrepared = false;
        private _proxyDataMap: Map<IClass<DataClass>, DataClass[]>;
        //用于销毁时做清理
        private _offerDataClassList: IClass<DataClass>[];

        /**
         * 可重复调用的数据更新
         */
        abstract refresh(): Promise<any>;

        // protected onPrepare() {}

        protected abstract initDataOffer();
        protected abstract initNetRequest();
        protected initNetPush(){};

        /**
         * 准备必要数据
         */
        async prepare(): Promise<any> {
            if (this._hasPrepared) {
                return this.fulfilled;
            } else {
                this.initDataOffer();
                this.initNetRequest();
                this.initNetPush();
                // this.onPrepare();
                let out = this.refresh();
                await out;
                this._hasPrepared = true;
                return out;
            }
        };

        $proxyDataMap(value: Map<IClass<DataClass>, DataClass[]>) {
            this._proxyDataMap = value;
            this._offerDataClassList = [];
        }

        /**
         * @final
         * @param data
         */
        protected offerData(data: DataClass | Array<DataClass>) {
            let dataClass: IClass<DataClass>;
            let dataList: DataClass[];
            if (Array.isArray(data)) {
                dataClass = <any>data[0].constructor;
                dataList = data;
            } else {
                dataClass = <any>data.constructor;
                dataList = [data];
            }
            this._proxyDataMap.set(dataClass, dataList);
            this._offerDataClassList.push(dataClass);
        }

        /**
         * @final
         * @param data
         */
        protected revokeData(dataClass: IClass<DataClass>) {
            this._proxyDataMap.delete(dataClass);
        }

        protected getData<T extends DataClass>(dataClass: IClass<T>): T[] {
            return <any>this._proxyDataMap.get(dataClass);
        }

        protected getServer<T extends BaseServer>(key: new() => T): T {
            return $internal.ServerCenter.Ins.getServer(key);
        }

        protected get fulfilled() {
            return fulfilledPromise;
        }

        dispose(): void {
            let dataMap = this._proxyDataMap;
            let list = this._offerDataClassList;
            for (let i = list.length - 1; i >= 0; --i) {
                let dataClass = list[i];
                let dataList = dataMap.get(dataClass);
                dataMap.delete(dataClass);
                for (let i = dataList.length - 1; i >= 0; --i) {
                    dataList[i].dispose();
                }
            }
            this._proxyDataMap = undefined;
        }
    }

    export interface IModelClass {
        new(): BaseModel;
    }
}