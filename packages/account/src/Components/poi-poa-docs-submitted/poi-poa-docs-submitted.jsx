import { Icon, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import classNames from 'classnames';
import { PlatformContext } from '@deriv/shared';
import { ContinueTradingButton } from 'Components/poa/continue-trading-button/continue-trading-button.jsx';
import PoiButton from 'Components/poi/poi-button';
import IconMessageContent from 'Components/icon-message-content';

const PoiPoaSubmitted = ({ toggleModal }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const message = localize('Your documents was submitted successfully');
    return (
        <div
            className={classNames('account-management__container', {
                'account-management__container-dashboard': is_appstore,
            })}
        >
            <IconMessageContent
                message={message}
                text={localize('We’ll review your documents and notify you of its status within 1 to 3 days.')}
                icon={<Icon icon='IcPoaVerified' size={128} />}
                full_width={is_appstore}
            >
                <Button has_effect text={localize('OK')} onClick={toggleModal} primary />
            </IconMessageContent>
        </div>
    );
};
export default PoiPoaSubmitted;