/**
 * Created by lintao_alex on 2019/6/18
 * @internal
 */
namespace Dream.frame.$internal {
    let msg: MessageCenter;

    export function getMsg() {
        return msg || (msg = new MessageCenter());
    }
}