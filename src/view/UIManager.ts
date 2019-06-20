///<reference path="UILayer.ts"/>
/**
 * Created by lintao_alex on 2019/6/19
 * @internal
 */
namespace Dream.frame {
    import DisplayObjectContainer = egret.DisplayObjectContainer;
    import GComponent = fairygui.GComponent;

    export class UIManager {
        private _uiMap = new Map<IUIClass, BaseUI<UIViewType>>();

        constructor(private _container: DisplayObjectContainer) {
            this.init();
        }

        private init() {
            let root = this.gRoot;
            this._container.addChild(root.displayObject);
            let layerEnum = UILayer;
            let idx = 0;
            let layer = layerEnum[idx];
            do {
                let gcp = new GComponent();
                gcp.name = layer;
                root.addChild(gcp);
                layer = layerEnum[++idx];
            } while (!!layer)
        }

        initObserver(observer: IObserver) {
            observer.care<UIAction>(UIAction.OPEN, this.doOpen, this);
        }

        private doOpen(msg: Message<UIAction>) {
            let map = this._uiMap;
            let data = msg.data;
            let uiClass = data.targetUI;
            let uiObj = map.get(uiClass);
            if (!uiObj) {
                uiObj = new uiClass();
                map.set(uiClass, uiObj);
            }
            let root = this.gRoot;
            let layerEnum = uiObj.layer;
            //todo pop or ui
            let parent = root.getChildAt(layerEnum) as GComponent;
            parent.addChild(uiObj.view);
            uiObj.open();
        }

        private get gRoot(){
            return fairygui.GRoot.inst;
        }
    }
}