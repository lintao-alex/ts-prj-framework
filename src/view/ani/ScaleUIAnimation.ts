/**
 * Created by lintao_alex on 2019/6/20
 */

namespace Dream.frame {
    export class ScaleUIAnimation extends BaseUIAnimation{

        start(cmpCall: () => void, thisObj: any): void {
            let view = this._view;
            view.scaleX = 0;
            view.scaleY = 0;
            egret.Tween.get(view).to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.quadOut).call(cmpCall, thisObj);
        }
    }
}