/**
 * Created by lintao_alex on 2019/6/20
 */
namespace Dream.frame {
    export class UIAction implements common.IClear {
        static readonly OPEN = 'UIAction.OPEN';
        static readonly CLOSE = 'UIAction.CLOSE';

        targetUI: IUIClass;

        clear(): void {
            this.targetUI = undefined;
        }

    }
}