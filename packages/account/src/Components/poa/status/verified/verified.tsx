import { Icon } from '@deriv/components';
import { isNavigationFromP2P, isNavigationFromDerivGO } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { ContinueTradingButton } from '../../continue-trading-button/continue-trading-button';
import IconMessageContent from '../../../icon-message-content';
import { PoiButton } from '../../../poi/poi-button/poi-button';
import { TPoaStatusProps } from '../../../../Types';

export const Verified = ({ needs_poi, redirect_button }: TPoaStatusProps) => {
    const message = localize('Your proof of address is verified');
    const is_redirected_from_platform = isNavigationFromP2P() || isNavigationFromDerivGO();
    if (needs_poi) {
        return (
            <div className='account-management__container'>
                <IconMessageContent
                    message={message}
                    text={localize('To continue trading, you must also submit a proof of identity.')}
                    icon={<Icon icon='IcPoaVerified' size={128} />}
                >
                    <PoiButton />
                </IconMessageContent>
            </div>
        );
    }
    return (
        <div className='account-management__container'>
            <IconMessageContent message={message} icon={<Icon icon='IcPoaVerified' size={128} />}>
                {redirect_button || (!is_redirected_from_platform && <ContinueTradingButton />)}
            </IconMessageContent>
        </div>
    );
};

export default Verified;
