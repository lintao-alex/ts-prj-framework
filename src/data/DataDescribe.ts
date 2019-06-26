/**
 * Created by lintao_alex on 2019/6/23
 */
namespace Dream.frame {
    export class DataDescribe<T> implements IDataDescribe<T>, common.IClear {
        dataClass: common.IClass<T>;
        check: IDataCondition<T>;
        thisObj: any;

        clear(): void {
            this.dataClass = undefined;
            this.check = undefined;
            this.thisObj = undefined;
        }
    }
}