/**
 * Created by lintao_alex on 2019/6/22
 */
namespace Dream.frame {
    export class BaseGetData<T> implements IGetData<T> {
        describe: Dream.frame.IDataDescribe<T>;
        onlyOne: boolean;
        result: Array<T>;
    }
}