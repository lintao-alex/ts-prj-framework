///<reference path="BaseUIArea.ts"/>
/**
 * Created by lintao_alex on 2019/6/20
 */
namespace Dream.frame {
    export class BaseUI<T extends UIViewType> extends BaseUIArea<T> {
        protected _modelList: IModelClass[];
        private _status: UI_Status;

        show() {
            this._status = UI_Status.showing;
            this.beforeShow();
            this.watchAndRend();
            let ani = this.getObj(this.openAniClass);
            ani.reset(this.view);
            ani.start(this.onShowAniEnd, this);
            this.recycleObj(ani);
        }

        private onShowAniEnd() {
            this._status = UI_Status.shown;
            this.afterShow();
        }

        hide() {
            this._status = UI_Status.hidden;
        }

        protected beforeShow() {}

        protected afterHide() {}

        protected get openAniClass(): common.IClass<BaseUIAnimation> {
            return BaseUIAnimation;
        }

        // get layer(): UILayer.ui|UILayer.uiPop{
        get layer(): UILayer {
            return UILayer.ui;
        }

        get modelPrepare(): Promise<any>[] {
            let modelList = this._modelList;
            if (modelList) {
                let out: Promise<any>[] = [];
                for (let i = modelList.length - 1; i >= 0; --i) {
                    let model = this.getModel(modelList[i]);
                    out.push(model.prepare());
                }
                return out;
            } else {
                return null;
            }
        }

        protected get status(): Dream.frame.UI_Status {
            return this._status;
        }

        protected createArea<T extends BaseUIArea<UIViewType>>(areaClass: new()=>T): T {
            let out = new areaClass();
            out.$updateBelong(this);
            return out;
        }
    }

    export interface IUIClass {
        new(): BaseUI<UIViewType>;
    }
}