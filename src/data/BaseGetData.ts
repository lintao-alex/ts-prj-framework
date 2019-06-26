/**
 * Created by lintao_alex on 2019/6/22
 */
namespace Dream.frame {
    export class BaseGetData<T> implements IGetData<T>, common.IClear {
        describe: IDataDescribe<T>;
        onlyOne: boolean;
        result: Array<T>;

        clear(): void {
            this.describe = undefined;
            this.onlyOne = undefined;
            this.result = undefined;
        }
    }
}