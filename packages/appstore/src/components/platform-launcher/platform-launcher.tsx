import React from 'react';
import { Text, Button } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import WalletIcon, { Icons } from 'Assets/svgs/wallet';
import { isMobile } from '@deriv/shared';
import { Link } from 'react-router-dom';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';

type TPlatformLauncherProps = {
    app_icon: keyof typeof Icons;
    app_title?: string;
    app_desc?: string;
    link_to?: string;
    href?: string;
    has_real_account: boolean;
    account_type: string;
};

const PlatformLauncher = ({
    app_icon,
    app_title,
    app_desc,
    link_to,
    href,
    has_real_account,
    account_type,
}: TPlatformLauncherProps) => {
    const { client } = useStores();

    const { is_eu } = client;

    const is_eu_description = 'Multipliers trading platform.';

    const app_description =
        app_desc === 'Options & multipliers trading platform.' && is_eu ? is_eu_description : app_desc;

    const TradeButton = (
        <Button primary className='platform-launcher__trade-button'>
            <Text size={isMobile() ? 'xxxs' : 's'} weight='bold' color='colored-background'>
                {localize('Trade')}
            </Text>
        </Button>
    );

    return (
        <div className={`platform-launcher${has_real_account ? '' : '-applauncher'}`}>
            <div className='platform-launcher__container'>
                <div className='platform-launcher__container--icon'>
                    <WalletIcon icon={app_icon} />
                </div>
                <div className='platform-launcher__container--title-desc-wrapper'>
                    <Text
                        size='xxs'
                        line_height={isMobile() ? 's' : 'l'}
                        className='platform-launcher__container--title-desc-wrapper--title'
                        weight='bold'
                    >
                        <Localize i18n_default_text={app_title} />
                    </Text>
                    <Text
                        size={isMobile() ? 'xxxs' : 'xxs'}
                        line_height='l'
                        className='platform-launcher__container--title-desc-wrapper--description'
                    >
                        <Localize i18n_default_text={app_description} />
                    </Text>
                </div>
            </div>
            {((has_real_account && account_type === 'real') || account_type === 'demo') && (
                <React.Fragment>
                    {link_to ? <Link to={link_to}>{TradeButton}</Link> : <a href={href}>{TradeButton}</a>}
                </React.Fragment>
            )}
        </div>
    );
};

export default observer(PlatformLauncher);
