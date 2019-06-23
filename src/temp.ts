/**
 * Created by lintao_alex on 2019/6/23
 */
namespace Dream.frame {
    export function getServer<T extends BaseServer>(key: new() => T): T {
        return $internal.ServerCenter.Ins.getServer(key)
    }
}