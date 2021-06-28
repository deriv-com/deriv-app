import BinarySocket from '_common/base/socket_base';
import { trackJSNetworkMonitor } from '@deriv/shared';

const WS = BinarySocket;

export default trackJSNetworkMonitor(WS);
