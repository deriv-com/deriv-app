import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Icon, Popover } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { localize } from '@deriv/translations';
import ApiTokenContext from './api-token-context';

const ApiTokenDeleteButton = ({ token, popoverAlignment = 'left' }) => {
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

    return (
        <>
            <Dialog
                is_visible={is_deleting}
                cancel_button_text={localize('Cancel')}
                confirm_button_text={localize('Yes, delete')}
                onCancel={handleNo}
                onConfirm={handleYes}
                className='da-api-token__dialog'
                secondary_button_type='button'
                primary_button_type='button'
                title='Delete token'
            >
                {localize('Are you sure you want to delete this token?')}
            </Dialog>
            <Popover
                alignment={popoverAlignment}
                classNameBubble='dc-clipboard__popover'
                message={localize('Delete this token')}
                relative_render={false}
                zIndex={9999}
            >
                <Icon
                    icon={'IcDelete'}
                    custom_color='var(--text-prominent)'
                    className='dc-clipboard da-api-token__delete-icon'
                    onClick={getConfirmationBeforeDelete}
                    size={14}
                    data_testid='dt_token_delete_icon'
                />
            </Popover>
        </>
    );
};

ApiTokenDeleteButton.propTypes = {
    token: PropTypes.shape({
        display_name: PropTypes.string.isRequired,
        last_used: PropTypes.string.isRequired,
        scopes: PropTypes.array.isRequired,
        token: PropTypes.string.isRequired,
    }).isRequired,
    popoverAlignment: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

export default ApiTokenDeleteButton;
