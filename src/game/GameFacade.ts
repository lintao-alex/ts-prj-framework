/**
 * Created by lintao_alex on 2019/6/20
 */

namespace Dream.frame {
    export class GameFacade {
        private _ui: UIManager;

        $initRoot(root: egret.DisplayObjectContainer){
            this._ui = new UIManager(root);
            this._ui.initObserver($internal.getMsg());
        }
    }
}