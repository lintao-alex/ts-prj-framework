/**
 * Created by lintao_alex on 2019/6/23
 */
namespace Dream.frame {
    export class DataUtils {
        private static _dataJudgeMap = new Map<any, Function>();

        static getDataFilter<T>(dataClass: common.IClass<T>): (get: IGetData<T>) => boolean {
            let out = this._dataJudgeMap.get(dataClass);
            if (!out) {
                out = this.createGetDataFilter(dataClass);
                this._dataJudgeMap.set(dataClass, out);
            }
            return <any>out;
        }

        private static createGetDataFilter(dataClass: any){
            return (get: IGetData<any>) => get.describe.dataClass == dataClass;
        }
    }
}