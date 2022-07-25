import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import { PlatformContext } from '@deriv/shared';
import IconMessageContent from 'Components/icon-message-content';

const PoiPoaSubmitted = ({ onClickOK, onClickYes, account_type, mt5_login_list }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const message = localize('Your documents were submitted successfully');
    let is_svg_created = false;
    if (account_type.type && account_type.category) {
        is_svg_created = mt5_login_list.filter(
            data =>
                data.market_type === account_type.type &&
                data.landing_company_short === 'svg' &&
                data.account_type === 'real'
        );
    }
    const SVGRoutingData = () => (
        <>
            <Text size='xs' align='center' className='poi-poa-submitted__svg-text'>
                {localize('Meanwhile, do you want to explore other accounts?')}
            </Text>
            <div className='poi-poa-submitted__svg-footer'>
                <Button has_effect text={localize('No')} onClick={onClickOK} secondary />
                <Button has_effect text={localize('Yes')} onClick={onClickYes} secondary />
            </div>
        </>
    );
    return (
        <IconMessageContent
            message={message}
            text={localize('We’ll review your documents and notify you of its status within 1 to 3 days.')}
            icon={<Icon icon='IcDocsSubmit' size={128} />}
            full_width={is_appstore}
            className='poi-poa-submitted'
        >
            {!is_svg_created.length ? (
                <SVGRoutingData />
            ) : (
                <Button has_effect text={localize('OK')} onClick={onClickOK} primary />
            )}
        </IconMessageContent>
    );
};
export default PoiPoaSubmitted;
