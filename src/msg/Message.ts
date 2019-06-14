/**
 * Created by lintao_alex on 2019/6/12
 */
namespace Dream.frame {
    export class Message<T> implements Dream.common.IClear{
        name: string;
        data: T;

        clear(){
            this.name = undefined;
            this.data = null;
        }
    }
}