/**
 * Created by lintao_alex on 2019/6/23
 */
namespace Dream.frame {
    export interface IDataNode<T> {
        data: T;
        next: IDataNode<T>;
    }

    export interface IDataCondition<T> {
        (data: T): boolean;
    }

    export interface IDataDescribe<T> {
        dataClass: common.IClass<T>;
        check?: IDataCondition<T>;
        thisObj?: any;
    }

    export interface IGetData<T> {
        describe: IDataDescribe<T>;
        onlyOne: boolean;
        result?: Array<T>;
    }
}