/**
 * Created by lintao_alex on 2019/6/11
 */


namespace Dream.frame.$Facade {
    export function getIns() {
        return _ins
    }

    class Facade implements IObserver {
        private _msg = new MessageCenter();
        private _modelMap = new Map<IModelClass, BaseModel>();

        getModel<T extends BaseModel>(key: new() => T): T {
            let out = this._modelMap.get(key);
            if (!out) {
                out = new key();
                this._modelMap.set(key, out);
            }
            return <any>out;
        }

        delModel(key: IModelClass) {
            let model = this._modelMap.get(key);
            if (model) {
                this._modelMap.delete(key);
                model.dispose();
            }
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

    let _ins = new Facade();
}