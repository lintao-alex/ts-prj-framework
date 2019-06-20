/**
 * Created by lintao_alex on 2019/6/20
 * 与UI组件绑定的显示区域
 */

namespace Dream.frame {
    import ObjectPool = common.ObjectPool;

    export type UIViewType = fairygui.GComponent;
    export class BaseUIArea<T extends UIViewType> extends ProxyObserver implements common.IDispose {
        constructor(private _view: T) {
            super();
            this.onInit();
        }

        protected onInit() {}

        protected onShown() {}

        protected onHide() {}

        get view() {
            return this._view;
        }

        protected getObj<T extends common.IClear>(objClass: new() => T) {
            return ObjectPool.getObj(objClass);
        }

        protected recycleObj(obj: common.IClear) {
            ObjectPool.recycleObj(obj);
        }

        dispose(): void {
        }
    }
}