/**
 * Created by lintao_alex on 2019/1/18
 */

namespace Dream.frame {
    import ByteArray = egret.ByteArray;

    export class NetResponseReader {
        private readonly _tool: ByteArray;
        private _lastOffset = 0;//前次残包的继点

        public callObj: any;
        public dealResponse: (reader: Uint8Array, command: string, packageId: number) => void;

        public constructor() {
            this._tool = new ByteArray()
        }

        public readSocket(socket: egret.WebSocket) {
            socket.readBytes(this._tool, this._lastOffset);
            this.dealBytes();
        }

        private dealBytes() {
            let tool = this._tool;
            let readAvailable = tool.readAvailable;
            if (readAvailable <= 4) {
                this._lastOffset = tool.length;
                return;
            }
            let packageLen = tool.readInt();
            if (readAvailable < packageLen) {
                tool.position -= 4;
                this._lastOffset = tool.length;
                return;
            }
            while (true) {
                let command = tool.readUTFBytes(32);
                let packageId = tool.readInt();
                //以下不再依赖ByteArray的读取方法
                let responseStart = tool.position + 12;//跳过信封
                let responseLen = packageLen - 52;
                let responseEnd = responseStart + responseLen;
                let response = tool.bytes.slice(responseStart, responseEnd);
                this.dealResponse.call(this.callObj, response, command, packageId);

                readAvailable = tool.length - responseEnd;
                if (readAvailable <= 0) {//完整结束
                    tool.clear();
                    this._lastOffset = 0;
                    break;
                } else {//后面还有粘包
                    if (readAvailable <= 4) {
                        this.cutBytes(tool, responseEnd);
                        break;
                    } else {
                        tool.position = responseEnd;//为后续能正常使用ByteArray的读取方法
                        packageLen = tool.readInt();
                        if (readAvailable < packageLen) {
                            this.cutBytes(tool, responseEnd);
                            break;
                        }
                    }
                }
            }
        }

        private cutBytes(tool: ByteArray, cutPoint: number) {
            let len = tool.length;
            tool.buffer = tool.rawBuffer.slice(cutPoint, len);
            tool.position = 0;
            this._lastOffset = tool.length;
        }
    }
}