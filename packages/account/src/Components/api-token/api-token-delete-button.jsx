import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Dialog, Icon, Popover } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { localize } from '@deriv/translations';
import ApiTokenContext from './api-token-context';

const ApiTokenDeleteButton = ({
    token,
    popover_props = {},
    popoverAlignment = 'left',
    popoverClassName,
    iconClassName,
}) => {
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
                classNameBubble={classNames('dc-clipboard__popover', popoverClassName)}
                message={localize('Delete this token')}
                {...popover_props}
            >
                <Icon
                    icon={'IcDelete'}
                    custom_color='var(--text-prominent)'
                    className={classNames('dc-clipboard', iconClassName)}
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
    popoverClassName: PropTypes.string,
    iconClassName: PropTypes.string,
    popoverAlignment: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

export default ApiTokenDeleteButton;
