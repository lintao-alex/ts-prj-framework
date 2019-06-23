/**
 * Created by lintao_alex on 2019/6/23
 */
namespace Dream.frame {
    export class DataNode<T> implements IDataNode<T>, common.IClear {
        data: T;
        next: Dream.frame.IDataNode<T>;

        clear(): void {
            this.data = undefined;
            if (this.next) {
                common.ObjectPool.recycleObj(this.next);
                this.next = null;
            }
        }

        append(node: IDataNode<T>) {
            this.next = node;
        }

        static create<T>(data: T): IDataNode<T> {
            return <any>common.ObjectPool.getObj(DataNode);
        }
    }
}