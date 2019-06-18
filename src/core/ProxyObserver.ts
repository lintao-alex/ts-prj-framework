/**
 * Created by lintao_alex on 2019/6/12
 */
namespace Dream.frame {
    export abstract class ProxyObserver implements IObserver {
        care<T>(msgName: string, action: (msg: Message<T>) => void, thisObj?: any, dataJudge?: (data: T) => boolean, once?: boolean, priority?: number) {
            $internal.getMsg().care(msgName, action, thisObj, dataJudge, once, priority);
        }

        abandon(msgName: string, action: (msg: Message<any>) => void, thisObj: any) {
            $internal.getMsg().abandon(msgName, action, thisObj);
        }

        sendMessage(msgName: string, data: any) {
            $internal.getMsg().sendMessage(msgName, data);
        }
    }
}