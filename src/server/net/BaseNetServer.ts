/**
 * Created by lintao_alex on 2019/6/14
 */


namespace Dream.frame {
    import ObjectPool = Dream.common.ObjectPool;
    import BackCall = Dream.common.BackCall;
    import ByteArray = egret.ByteArray;

    export type IRequestParam = any;
    export type IPushData = any;

    export abstract class BaseNetServer extends BaseServer {
        private readonly LOG_MARK = '[socket] ';
        private _socket: egret.WebSocket;
        private _onConnectCall: () => void;

        private _pushCallMap = new Map<string, Array<BackCall<Function>>>();
        private _readyPkgList: NetCallNode<any>[];
        private _pendingPkgList: NetCallNode<any>[];
        private _responseReader: NetResponseReader;

        //todo rename to 'request'
        public sendRequest<T>(command: string, param?: IRequestParam) {
            let node: NetCallNode<T> = ObjectPool.getObj(NetCallNode);
            node.command = command;
            node.param = param;
            let out = new Promise<INetResolve<T>>((resolve, reject) => {
                node.resolve = resolve;
                node.reject = reject;
            })
            this._readyPkgList.push(node);
            this.readyToSendPkg();
            return out;
        }

        public registerPush(command: string, callFuc: (data: IPushData) => void, callObj: any) {
            let callList = this._pushCallMap.get(command);
            if (!callList) {
                callList = [];
                this._pushCallMap.set(command, callList);
            } else {
                for (let i = callList.length - 1; i >= 0; i--) {
                    let node = callList[i];
                    if (node.sameWith(callFuc, callObj)) {
                        let stack = new Error().stack;
                        console.warn('this call has been registered!!!  ' + stack);
                        return;
                    }
                }
            }
            let newNode = ObjectPool.getObj(BackCall) as BackCall<any>;
            newNode.reset(callFuc, callObj);
            callList.push(newNode);
        }

        public unRegisterPush(command: string, callFuc: Function, callObj: any) {
            let callList = this._pushCallMap.get(command);
            if (callList) {
                for (let i = callList.length - 1; i >= 0; i--) {
                    let node = callList[i];
                    if (node.sameWith(callFuc, callObj)) {
                        callList.slice(i, 1);
                        if (common.ArrayUtils.isEmpty(callList)) {
                            this._pushCallMap.delete(command);
                        }
                        break;
                    }
                }
            }
        }

        $init(host: string, port: number) {
            this._readyPkgList = [];
            this._pendingPkgList = [];

            let mSocket = new egret.WebSocket();
            mSocket.type = egret.WebSocket.TYPE_BINARY;
            mSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveData, this);
            mSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIoError, this);
            mSocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            mSocket.addEventListener(egret.Event.CONNECT, this.onSocketConnect, this);
            mSocket.connect(host, port);
            this.socketLog('ready connect to [' + host + ':' + port + ']');

            this._socket = mSocket;
            let reader = new NetResponseReader();
            reader.callObj = this;
            reader.dealResponse = this.dealResponse;
            this._responseReader = reader;
            return new Promise<any>((resolve, reject) => {
                this._onConnectCall = resolve;
                //todo connectErr
            })
        }

        private readyToSendPkg() {
            //todo myTimeout
            setTimeout(this.checkPackage.bind(this), 200)
        }

        private checkPackage() {
            let pkgNode = this._readyPkgList.shift();
            if (pkgNode) {
                this._pendingPkgList.push(pkgNode);
                this.sendPackage(pkgNode);
                this.readyToSendPkg();
            }
        }

        private sendPackage(node: NetCallNode<any>) {
            let collect = new ByteArray();
            collect.endian = egret.Endian.BIG_ENDIAN;
            collect.writeUTFBytes(node.command);
            collect.length = 32;
            collect.position = 32;
            collect.writeInt(node.id);
            collect.writeShort(1);
            collect.writeShort(3);
            collect.writeShort(0);
            collect.writeShort(1);
            collect.writeInt(0);
            let param = node.param;
            if (param) {
                let msgBuffer = param.constructor.encode(param).finish();
                let msgByte = new ByteArray(msgBuffer);
                collect.writeBytes(msgByte, 0, msgByte.length);
            }
            let out = new ByteArray();
            out.endian = egret.Endian.BIG_ENDIAN;
            out.writeInt(collect.length + 4);
            out.writeBytes(collect);
            let logContent = 'send ' + node.command;
            if (param) logContent += '[' + egret.getQualifiedClassName(param) + ']: ' + this.stringifyProto(param);
            this.socketLog(logContent);
            this._socket.writeBytes(out, 0, out.length);
            this._socket.flush();
        }

        private onReceiveData() {
            this._responseReader.readSocket(this._socket);
        }

        private dealResponse(responseReader: Uint8Array, receiveCommand: string, packageId: number) {
            if (this.isPush(receiveCommand)) {
                //推送
                let responseClass = this.getResponseClass(receiveCommand);
                let logContent = 'gotPush ' + receiveCommand;
                if (responseClass) {
                    let responseObj = responseClass.decode(responseReader);
                    logContent += '[' + egret.getQualifiedClassName(responseClass) + ']: ' + this.stringifyProto(responseObj);
                    this.socketLog(logContent);
                    let callList = this._pushCallMap.get(receiveCommand);
                    if (callList) {
                        for (let i = callList.length - 1; i >= 0; i--) {
                            callList[i].invoke(responseObj)
                        }
                    }
                } else {
                    console.warn(logContent + ' but not find the decode class')
                }
            } else {
                let commonResult = this.decodeCommonResponse(responseReader);
                let pkgNode = common.ArrayUtils.search(this._pendingPkgList, ['id', packageId]);
                if (commonResult.actionResult == 1) {
                    //正常返回
                    if (!pkgNode) {
                        this.socketLog('have not send the package');
                    } else {
                        let responseClass = this.getResponseClass(pkgNode.command);
                        let logContent = 'receive ' + pkgNode.command;
                        if (responseClass) {
                            let responseObj = responseClass.decode(responseReader);
                            logContent += '[' + egret.getQualifiedClassName(responseClass) + ']: ' + this.stringifyProto(responseObj);
                            this.socketLog(logContent);
                            pkgNode.invokeResponse(responseObj);
                        }
                        else {
                            this.socketLog(logContent);
                            pkgNode.invokeResponse(commonResult);
                        }
                        common.ArrayUtils.remove(this._pendingPkgList, pkgNode);
                        ObjectPool.recycleObj(pkgNode);
                    }
                } else if (commonResult.actionResult == 2) {
                    //服务器出问题了
                    this.socketLog('service error: ' + commonResult.msg)
                } else if (commonResult.actionResult == 0) {
                    //接口调用错误
                    this.socketLog('error call: ' + commonResult.msg);
                    if (pkgNode) pkgNode.errorResponse(commonResult);
                } else {
                    this.socketLog('service error: ' + commonResult.msg)
                }
            }
        }

        private onSocketConnect() {
            if (this._onConnectCall) {
                let tempCall = this._onConnectCall;
                this._onConnectCall = null;
                tempCall();
            }
            this.startHeartBeat();
        }


        protected socketLog(msg: string) {
            console.log(this.LOG_MARK + msg)
        }

        private _heartBeatId = -1;

        private startHeartBeat() {
            if (this._heartBeatId < 0) {
                //todo myInterval
                setInterval(this.heartBeat.bind(this), 40000)
            }
        }

        private heartBeat() {
            this.sendRequest('system@heartbeat')
        }

        protected abstract isPush(command: string): boolean;

        protected abstract getResponseClass(command: string): IProtoClass;

        protected abstract decodeCommonResponse(reader: Uint8Array): IResponseData

        protected stringifyProto(proto: any): string {
            return '';
        }

        protected onSocketClose(evt: egret.Event) {
            this.socketLog("close");
        }

        protected onIoError(evt: egret.IOErrorEvent) {
            this.socketLog("IoError");
        }
    }

    export interface IResponseData {
        actionResult: number;
        msg: string;

        [propName: string]: any;
    }

    export interface IProtoClass {
        encode(message: any, writer?: protobuf.Writer): protobuf.Writer;

        decode(reader: (protobuf.Reader | Uint8Array), length?: number): any;
    }
}