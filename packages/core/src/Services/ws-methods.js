import BinarySocket              from '_common/base/socket_base';
import { trackJSNetworkMonitor } from './trackjs';

const WS = BinarySocket;

export default trackJSNetworkMonitor(WS);
