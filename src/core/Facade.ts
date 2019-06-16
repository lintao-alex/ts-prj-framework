/**
 * Created by lintao_alex on 2019/6/11
 */


namespace Dream.frame.$Facade {
    export function getIns() {
        return _ins || (_ins = new Facade());
    }

    class Facade implements IObserver {
        private _msg = new MessageCenter();
        private _modelMap = new Map<IModelClass, BaseModel>();
        private _serverMap = new Map<IServerClass, BaseServer>();

        getModel<T extends BaseModel>(key: new() => T): T {
            let map = this._modelMap;
            let out = map.get(key);
            if (!out) {
                out = new key();
                map.set(key, out);
            }
            return <any>out;
        }

        delModel(key: IModelClass) {
            let map = this._modelMap;
            let model = map.get(key);
            if (model) {
                map.delete(key);
                model.dispose();
            }
        }

        getServer<T extends BaseServer>(key: new() => T): T {
            let map = this._serverMap;
            let out = map.get(key);
            if (!out) {
                out = new key();
                map.set(key, out);
            }
            return <any>out;
        }

        care<T>(msgName: string, action: (msg: Message<T>) => void, thisObj?: any, dataJudge?: (data: T) => boolean, once?: boolean, priority?: number) {
            this._msg.care(msgName, action, thisObj, dataJudge, once, priority);
        }

        abandon(msgName: string, action: (msg: Message<any>) => void, thisObj: any) {
            this._msg.abandon(msgName, action, thisObj);
        }

        sendMessage(msgName: string, data: any) {
            this._msg.sendMessage(msgName, data);
        }
    }
    let _ins: Facade;
}