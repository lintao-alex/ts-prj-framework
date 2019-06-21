///<reference path="ProxyObserver.ts"/>
/**
 * Created by lintao_alex on 2019/6/14
 */

namespace Dream.frame {
    export abstract class BaseModel extends ProxyObserver implements common.IDispose {
        dispose(): void {}
        protected getServer<T extends BaseServer>(key: new() => T): T {
            return $internal.ServerCenter.Ins.getServer(key);
        }
    }

    export interface IModelClass {
        new(): BaseModel;
    }
}