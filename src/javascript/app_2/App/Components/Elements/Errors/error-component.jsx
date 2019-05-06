import PropTypes     from 'prop-types';
import React         from 'react';
import { localize }  from '_common/localize';
import PageError     from 'Modules/PageError';
import { routes }    from 'Constants/index';
import Localize      from '../localize.jsx';

const ErrorComponent = ({ message }) => {
    let msg = '';
    if (typeof message === 'object') {
        msg = <Localize
            str={message.str}
            replacers={message.replacers}
        />;
    } else {
        msg = message;
    }
    const refresh_message = localize('Please refresh this page to continue.');
    return (
        <PageError
            header={localize('Oops, something went wrong.')}
            messages={
                msg
                    ? [
                        msg,
                        refresh_message,
                    ]
                    : [
                        localize('Sorry, an error occured while processing your request.'),
                        refresh_message,
                    ]}
            redirect_url={routes.trade}
            redirect_label={localize('Refresh')}
            buttonOnClick={() => location.reload()}
        />
    );
};

ErrorComponent.propTypes = {
    message: PropTypes.oneOfType([
        PropTypes.shape({
            replacers: PropTypes.object,
            str      : PropTypes.string,
        }),
        PropTypes.string,
    ]),
    type: PropTypes.string,
};

export default ErrorComponent;
