/**
 * Created by lintao_alex on 2019/6/14
 */
namespace Dream.frame {
    export interface IObserver {
        care<T>(msgName: string, action: (msg: Message<T>) => void, thisObj?: any, dataJudge?: (data: T) => boolean, once?:boolean, priority?:number);
        abandon(msgName: string, action: (msg: Message<any>) => void, thisObj: any);
        sendMessage(msgName: string, data: any);
    }
}