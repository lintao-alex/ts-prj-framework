/**
 * Created by lintao_alex on 2019/6/14
 */

namespace Dream.frame {
    export abstract class BaseView extends ProxyObserver implements common.IDispose {
        abstract dispose(): void;
    }
}