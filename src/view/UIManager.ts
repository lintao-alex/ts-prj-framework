///<reference path="UILayer.ts"/>
/**
 * Created by lintao_alex on 2019/6/19
 */

namespace Dream.frame {
    import DisplayObjectContainer = egret.DisplayObjectContainer;
    import GComponent = fairygui.GComponent;

    export class UIManager {
        constructor(private _container: DisplayObjectContainer) {
            this.init();
        }

        private init() {
            let gRoot = fairygui.GRoot.inst;
            this._container.addChild(gRoot.displayObject);
            let layerEnum = UILayer;
            let idx = 0;
            let layer = layerEnum[idx];
            do {
                let gcp = new GComponent();
                gcp.name = layer;
                gRoot.addChild(gcp);
                layer = layerEnum[++idx];
            } while (!!layer)
        }
    }
}