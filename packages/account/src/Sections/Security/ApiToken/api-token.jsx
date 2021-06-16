import ApiToken from 'Components/api-token/api-token.jsx';
import { connect } from 'Stores/connect';
import { WS } from '@deriv/shared';

export default connect(({ client }) => ({ is_switching: client.is_switching, ws: WS }))(ApiToken);
