/**
 * Created by lintao_alex on 2019/6/12
 */
namespace Dream.frame {
    export abstract class ProxyObserver implements IObserver {
        care<T>(msgName: string, action: (msg: Message<T>) => void, thisObj?: any, dataJudge?: (data: T) => boolean, once?: boolean, priority?: number) {
            $Facade.getIns().care(msgName, action, thisObj, dataJudge, once, priority);
        }

        abandon(msgName: string, action: (msg: Message<any>) => void, thisObj: any) {
            $Facade.getIns().abandon(msgName, action, thisObj);
        }

        sendMessage(msgName: string, data: any) {
            $Facade.getIns().sendMessage(msgName, data);
        }
    }
}