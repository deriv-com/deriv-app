import { ApiToken } from '@deriv/account';
import { connect } from 'Stores/connect';
import { WS } from 'Services';

export default connect(({ client }) => ({ is_switching: client.is_switching, ws: WS }))(ApiToken);
