/**
 * Created by lintao_alex on 2019/6/22
 */
namespace Dream.frame {
    export class BaseGetData<T> implements IGetData<T> {
        describe: IDataDescribe<T>;
        onlyOne: boolean;
        result: Array<T>;

        constructor(describe: IDataDescribe<T>){
            this.describe = describe;
        }
    }
}