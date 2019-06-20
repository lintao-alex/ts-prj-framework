///<reference path="BaseUIArea.ts"/>
/**
 * Created by lintao_alex on 2019/6/20
 */
namespace Dream.frame {
    export class BaseUI<T extends UIViewType> extends BaseUIArea<T> {
        open() {
            this.beforeShow();
            let ani = this.getObj(this.openAniClass);
            ani.reset(this.view);
            ani.start(this.onShown, this);
            this.recycleObj(ani);
        }

        close() {

        }

        protected beforeShow(){}

        protected afterHidden(){}

        protected get openAniClass(): common.IClass<BaseUIAnimation> {
            return BaseUIAnimation;
        }

        // get layer(): UILayer.ui|UILayer.uiPop{
        get layer(): UILayer{
            return UILayer.ui;
        }
    }

    export interface IUIClass {
        new(): BaseUI<UIViewType>;
    }
}