import PropTypes from 'prop-types';
import * as React from 'react';
import { Button } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import ApiTokenContext from './api-token-context';

const ApiTokenDeleteButtons = ({ token }) => {
    const { deleteToken } = React.useContext(ApiTokenContext);
    const [is_deleting, setIsDeleting] = React.useState(false);
    const isMounted = useIsMounted();
    const timeout_ref = React.useRef(null);

    const getConfirmationBeforeDelete = () => setIsDeleting(true);

    const handleNo = () => setIsDeleting(false);

    const handleYes = () => {
        deleteToken(token.token).finally(() => {
            if (isMounted()) setIsDeleting(false);
        });
    };

    React.useEffect(() => {
        if (is_deleting) {
            timeout_ref.current = setTimeout(() => {
                if (isMounted()) setIsDeleting(false);
            }, 10000);
        } else {
            clearTimeout(timeout_ref.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_deleting]);

    if (is_deleting) {
        return (
            <Button.Group>
                <Button type='button' secondary small onClick={handleNo}>
                    <Localize i18n_default_text='No' />
                </Button>
                <Button type='button' secondary small onClick={handleYes}>
                    <Localize i18n_default_text='Yes' />
                </Button>
            </Button.Group>
        );
    }

    return (
        <Button type='button' secondary small onClick={getConfirmationBeforeDelete}>
            <Localize i18n_default_text='Delete' />
        </Button>
    );
};

ApiTokenDeleteButtons.propTypes = {
    token: PropTypes.shape({
        display_name: PropTypes.string.isRequired,
        last_used: PropTypes.string.isRequired,
        scopes: PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
    }).isRequired,
};

export default ApiTokenDeleteButtons;
