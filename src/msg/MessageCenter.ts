/**
 * Created by lintao_alex on 2019/6/12
 */


namespace Dream.frame {
    import ObjectPool = Dream.common.ObjectPool;

    export class MessageCenter implements IObserver{
        private _reactionMap = new Map<string, Reaction<any>[]>();

        /**
         *
         * @param msgName
         * @param action
         * @param thisObj
         * @param dataJudge 对消息的数据进行判别，当符合条件时才触发回调。不参加重复回调的判别
         * @param once
         * @param priority
         */
        care<T>(msgName: string, action: (msg: Message<T>) => void, thisObj?: any, dataJudge?: (data: T) => boolean, once?: boolean, priority = 0) {
            let reactList = this._reactionMap.get(msgName);
            if (reactList) {
                let trgIdx = 0;
                let checkIdx: number;
                for (checkIdx = reactList.length - 1; checkIdx >= 0; checkIdx--) {
                    let react = reactList[checkIdx];
                    if (this.isSameReaction(action, thisObj, react)) return;
                    if (priority <= react.priority) {
                        trgIdx = checkIdx + 1;
                        break;
                    }
                }
                //若因找到合适的插入位置而打断，则要继续检查是否为重复的侦听
                if (--checkIdx > 0) {
                    while (checkIdx >= 0) {
                        if (this.isSameReaction(action, thisObj, reactList[checkIdx])) return;
                        --checkIdx;
                    }
                }
                //添加的时候不必考虑列表浅复制
                reactList.splice(trgIdx, 0, this.getReaction(action, thisObj, dataJudge, once, priority));
            } else {
                this._reactionMap.set(msgName, [this.getReaction(action, thisObj, dataJudge, once, priority)])
            }
        }

        abandon(msgName: string, action: (msg: Message<any>) => void, thisObj: any) {
            let reactList = this._reactionMap.get(msgName);
            if (reactList) {
                //移除的时候不必考虑列表浅复制
                for (let i = reactList.length - 1; i >= 0; --i) {
                    let react = reactList[i];
                    if (this.isSameReaction(action, thisObj, react)) {
                        reactList.splice(i, 1);
                        this.onRemoveReact(msgName, react, reactList);
                        return;
                    }
                }
            }
        }

        /**
         * 放弃指定消息的所有侦听
         */
        abandonByMsgName(msgName: string) {
            let reactList = this._reactionMap.get(msgName);
            if (reactList) {
                this.clearReactList(reactList);
                this._reactionMap.delete(msgName);
            }
        }

        /**
         * 放弃所有消息侦听
         */
        abandonAll() {
            this._reactionMap.forEach(this.clearReactList, this);
            this._reactionMap.clear();
        }

        sendMessage(msgName: string, data: any) {
            let reactList = this._reactionMap.get(msgName);
            if (reactList) {
                let msg = ObjectPool.getObj(Message);
                msg.data = data;
                msg.name = msgName;
                //发送引起的回调中可能引起列表的变化，所以生成一个副本来处理。这里不使用concat，因为copyList的length可能会比reactList小
                let copyList: Reaction<any>[] = [];
                for (let i = 0, len = reactList.length; i < len; ++i) {
                    let react = reactList[i];
                    if (react.judgeData(data)) {
                        copyList.push(react);
                    }
                }
                for (let i = 0, len = copyList.length; i < len; ++i) {
                    let react = copyList[i];
                    react.doAction(msg);
                    if (react.once && common.ArrayUtils.remove(reactList, react)) {//自动移除单次回调,这里考虑了回调中触发移除的可能
                        this.onRemoveReact(msgName, react, reactList);
                    }
                }
                ObjectPool.recycleObj(msg);
            }
        }

        private onRemoveReact(msgName: string, react: Reaction<any>, reactList: Reaction<any>[]) {
            this.clearReact(react);
            if (common.ArrayUtils.isEmpty(reactList)) {//第一位都没有了，说明列表已清空
                this._reactionMap.delete(msgName);
            }
        }

        private clearReactList(reactList: Reaction<any>[]) {
            for (let i = reactList.length - 1; i >= 0; --i) {
                this.clearReact(reactList[i]);
            }
        }

        private clearReact(react: Reaction<any>) {
            ObjectPool.recycleObj(react);
        }

        private isSameReaction(action: any, thisObj: any, oldOne: Reaction<any>) {
            return oldOne.action == action && oldOne.thisObj == thisObj;
        }

        private getReaction<T>(action: (msg: Message<T>) => void, thisObj: any, dataJudge: (data: T) => boolean, once: boolean, pripority: number) {
            let out = ObjectPool.getObj(Reaction);
            out.reset();
            out.action = action;
            out.thisObj = thisObj;
            out.dataJudge = dataJudge;
            out.once = once;
            out.priority = pripority;
            return out;
        }
    }

    class Reaction<T> implements Dream.common.IClear {
        /**
         * 用以保证被移除的回调不会触发，可能的使用情况是回调触发时，移除了后面即将要出发的回调
         * example:
         * action1(msg){
         *     observer.abandon('lala',action2,this)
         *     ...
         * };
         * action2(msg){...};
         * observer.care('lala', action1, this);
         * observer.care('lala', action2, this);
         */
        private _hasClear = false;

        action: (msg: Message<T>) => void;
        thisObj: any;
        dataJudge?: (data: T) => boolean;
        once: boolean;
        priority: number;

        reset() {
            this._hasClear = false;
        }

        clear() {
            this.action = undefined;
            this.thisObj = undefined;
            this.dataJudge = undefined;
            this.once = undefined;
            this.priority = undefined;
            this._hasClear = true;
        }

        judgeData(data: T) {
            if(this._hasClear) return false;
            let judgeFuc = this.dataJudge;
            if (judgeFuc) return judgeFuc.call(this.thisObj, data);
            return true;
        }

        doAction(msg: Message<T>) {
            if(this._hasClear) return;
            this.action.call(this.thisObj, msg);
        }
    }
}