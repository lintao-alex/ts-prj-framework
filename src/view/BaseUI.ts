///<reference path="BaseUIArea.ts"/>
/**
 * Created by lintao_alex on 2019/6/20
 */
namespace Dream.frame {
    export class BaseUI<T extends UIViewType> extends BaseUIArea<T> {
        protected _modelList: IModelClass[];

        open() {
            this.beforeShow();
            let ani = this.getObj(this.openAniClass);
            ani.reset(this.view);
            ani.start(this.afterShow, this);
            this.recycleObj(ani);
        }

        close() {

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
            if(modelList){
                let out: Promise<any>[] = [];
                for (let i = modelList.length - 1; i >= 0; --i) {
                    let model = this.getModel(modelList[i]);
                    out.push(model.prepare());
                }
                return out;
            }else{
                return null;
            }
        }
    }

    export interface IUIClass {
        new(): BaseUI<UIViewType>;
    }
}