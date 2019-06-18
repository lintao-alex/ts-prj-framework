/**
 * Created by lintao_alex on 2019/6/18
 */
namespace Dream.frame {
    export abstract class BaseGameInit {
        protected getModel<T extends BaseModel>(modelClass: new() => T): T {
            return $internal.ModelCenter.Ins.getModel(modelClass);
        }

        protected getServer<T extends BaseServer>(serverClass: new() => T): T {
            return $internal.ServerCenter.Ins.getServer(serverClass);
        }
    }
}