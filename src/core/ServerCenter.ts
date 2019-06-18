/**
 * Created by lintao_alex on 2019/6/18
 * @internal
 */
namespace Dream.frame.$internal {
    export class ServerCenter {
        private _serverMap = new Map<IServerClass, BaseServer>();

        getServer<T extends BaseServer>(key: new() => T): T {
            let map = this._serverMap;
            let out = map.get(key);
            if (!out) {
                out = new key();
                map.set(key, out);
            }
            return <any>out;
        }

        private static _INSTANCE: ServerCenter;

        static get Ins() {
            return this._INSTANCE || (this._INSTANCE = new ServerCenter());
        }
    }
}