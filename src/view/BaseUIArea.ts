/**
 * Created by lintao_alex on 2019/6/20
 * 与UI组件绑定的显示区域
 */


namespace Dream.frame {
    import ObjectPool = common.ObjectPool;
    import IClass = Dream.common.IClass;

    export type UIViewType = fairygui.GComponent;

    export class BaseUIArea<T extends UIViewType> extends ProxyObserver implements common.IDispose {
        protected _belong: BaseUIArea<UIViewType>;
        private _dataViewList: IDataView[];

        constructor(private _view: T) {
            super();
            this._dataViewList = [];
            this.onInit();
        }

        $updateBelong(value: BaseUIArea<UIViewType>){
            this._belong = value;
        }

        show() {
            this.watchAndRend();
            this.afterShow();
        }

        hide() {
            this.beforeHide();
        }

        protected onInit() {}

        protected afterShow() {}

        protected beforeHide() {}

        get view() {
            return this._view;
        }

        protected watchAndRend() {
            let list = this._dataViewList;
            for (let i = list.length - 1; i >= 0; --i) {
                let dataView = list[i];
                let data = dataView.getData;
                this.sendMessage(DataMessage.GET, data);
                let render = dataView.render;
                let resultList = data.result;
                for (let j = resultList.length - 1; j >= 0; --j) {
                    let dataElement = resultList[j];
                    render.call(this, dataElement);
                    dataElement.watch(render, this);
                }
            }
        }

        protected bindDataView<T extends BaseVO<any>>(render: (data: T) => void, dataClass: IClass<T>, onlyOne = false, dataFilter?: IDataCondition<T>) {
            let getData = this.createGetData(dataClass, onlyOne, dataFilter);
            this._dataViewList.push({ getData, render });
        }

        protected createGetData<T extends BaseVO<any>>(dataClass: IClass<T>, onlyOne = false, dataFilter?: IDataCondition<T>) {
            let describe = this.getObj(DataDescribe) as IDataDescribe<any>;
            describe.dataClass = dataClass;
            describe.check = dataFilter;
            describe.thisObj = this;
            let getData = this.getObj(BaseGetData) as IGetData<any>;
            getData.describe = describe;
            getData.onlyOne = onlyOne;
            return getData;
        }

        protected getObj<T extends common.IClear>(objClass: new() => T) {
            return ObjectPool.getObj(objClass);
        }

        protected recycleObj(obj: common.IClear) {
            ObjectPool.recycleObj(obj);
        }

        protected getModel<T extends BaseModel>(modelClass: new() => T): T {
            return $internal.ModelCenter.Ins.getModel(modelClass)
        }

        protected getServer<T extends BaseServer>(serverClass: new() => T): T {
            return $internal.ServerCenter.Ins.getServer(serverClass)
        }

        dispose(): void {
        }

        protected get status(): UI_Status {
            if(this._belong) return this._belong.status;
            return UI_Status.hidden;
        }
    };


    interface IDataView {
        getData: IGetData<BaseVO<any>>;
        render: (data: BaseVO<any>) => void;
    }
}