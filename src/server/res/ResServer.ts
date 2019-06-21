/**
 * Created by lintao_alex on 2019/6/18
 */

namespace Dream.frame {
    import PromiseTaskReporter = RES.PromiseTaskReporter;

    export class ResServer extends BaseServer {
        $loadConfig(url: string, resourceRoot: string) {
            return RES.loadConfig(url, resourceRoot);
        }

        loadGroup(name: string, priority?: number, reporter?: PromiseTaskReporter) {
            return RES.loadGroup(name, priority, reporter);
        }

        getRes(key: string) {
            return RES.getRes(key);
        }

        getResAsync(key: string) {
            return RES.getResAsync(key) as Promise<any>
        }
    }
}