/**
 * Created by lintao_alex on 2019/6/23
 */
namespace Dream.frame {
    export class DataDescribe<T> implements IDataDescribe<T> {
        dataClass: common.IClass<T>;
        check: IDataCondition<T>;
        constructor(dataClass:common.IClass<T>){
            this.dataClass = dataClass;
        }
    }
}