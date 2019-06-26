/**
 * Created by lintao_alex on 2019/6/18
 * @internal
 */

namespace Dream.frame.$internal {
    import IClass = Dream.common.IClass;

    type DataClass = BaseVO<any>;
    export class ModelCenter extends ProxyObserver {
        private _modelMap = new Map<IModelClass, BaseModel>();
        //由各个模块来提供数据，提示数据搜索效率
        private _dataMap = new Map<IClass<DataClass>, DataClass[]>();

        constructor() {
            super();
            this.care(DataMessage.GET, this.searchData, this)
        }

        private searchData(msg: Message<IGetData<DataClass>>) {
            let getData = msg.data;
            let describe = getData.describe;
            let dataList = this._dataMap.get(describe.dataClass);
            if (dataList) {
                if (describe.check) {
                    if (getData.onlyOne) {
                        getData.result = [Dream.common.ArrayUtils.find(dataList, describe.check, describe.thisObj)];
                    } else {
                        getData.result = dataList.filter(describe.check, describe.thisObj);
                    }
                } else {
                    getData.result = dataList.concat();
                }
            }
        }

        getModel<T extends BaseModel>(key: new() => T): T {
            let map = this._modelMap;
            let out = map.get(key);
            if (!out) {
                out = new key();
                out.$proxyDataMap(this._dataMap);
                map.set(key, out);
            }
            return <any>out;
        }

        delModel(key: IModelClass) {
            let map = this._modelMap;
            let model = map.get(key);
            if (model) {
                map.delete(key);
                model.dispose();
            }
        }

        private static _INSTANCE: ModelCenter;

        static get Ins() {
            return this._INSTANCE || (this._INSTANCE = new ModelCenter());
        }
    }
}