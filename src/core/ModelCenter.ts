/**
 * Created by lintao_alex on 2019/6/18
 * @internal
 */
namespace Dream.frame.$internal {
    export class ModelCenter {
        private _modelMap = new Map<IModelClass, BaseModel>();

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

        private static _INSTANCE: ModelCenter;

        static get Ins() {
            return this._INSTANCE || (this._INSTANCE = new ModelCenter());
        }
    }
}