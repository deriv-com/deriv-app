import React, { ComponentProps } from 'react';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useActiveLinkedToTradingAccount } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { optionsAndMultipliersContent } from '../../constants/constants';
import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../../helpers/urls';
import useDevice from '../../hooks/useDevice';
import { TRoute } from '../../routes/Router';
import { TSubscribedBalance } from '../../types';
import { WalletLink, WalletText } from '../Base';
import { DerivAppsSection } from '../DerivAppsSection';
import { TradingAccountCard } from '../TradingAccountCard';
import { WalletMarketIcon } from '../WalletMarketIcon';
import './OptionsAndMultipliersListing.scss';
import { object } from 'yup';

const LinkTitle: React.FC<{ platform: ComponentProps<typeof WalletMarketIcon>['icon'] }> = ({ platform }) => {
    const handleClick = (event: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        event.persist();
        switch (platform) {
            case 'trader':
                window.open(getStaticUrl(`/dtrader`));
                break;
            case 'bot':
                window.open(getStaticUrl(`/dbot`));
                break;
            case 'smarttrader':
                window.open(getUrlSmartTrader());
                break;
            case 'binarybot':
                window.open(getUrlBinaryBot());
                break;
            case 'derivgo':
                window.open(getStaticUrl('/deriv-go'));
                break;
            default:
                break;
        }
    };

    return (
        <div
            className='wallets-options-and-multipliers-listing__content__icon'
            onClick={handleClick}
            // Fix sonarcloud issue
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'Enter') {
                    handleClick(event);
                }
            }}
        >
            <WalletMarketIcon icon={platform} size='lg' />
        </div>
    );
};

const OptionsAndMultipliersListing: React.FC<TSubscribedBalance> = ({ balance }) => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();

    return (
        <div className='wallets-options-and-multipliers-listing'>
            <section className='wallets-options-and-multipliers-listing__header'>
                <div className='wallets-options-and-multipliers-listing__header-title'>
                    {!isMobile && (
                        <WalletText align='center' size='xl' weight='bold'>
                            <Trans defaults='Options' />
                        </WalletText>
                    )}
                    <WalletText size={isMobile ? 'sm' : 'md'}>
                        <Trans
                            components={[
                                <WalletLink key={0} staticUrl='/trade-types/options/digital-options/up-and-down/' />,
                            ]}
                            defaults='Buy or sell at a specific time for a specific price. <0>Learn more</0>'
                        />
                    </WalletText>
                </div>
                <DerivAppsSection balance={balance} />
            </section>
            <div className='wallets-options-and-multipliers-listing__content'>
                {optionsAndMultipliersContent.map(account => {
                    const { description, key, redirect, title } = account;
                    return (
                        <TradingAccountCard
                            {...account}
                            disabled={!activeLinkedToTradingAccount?.loginid}
                            key={`trading-account-card-${title}`}
                            leading={<LinkTitle platform={key} />}
                            onClick={() => {
                                account.isExternal ? window.open(redirect, '_blank') : history.push(redirect as TRoute);
                            }}
                            trailing={
                                activeLinkedToTradingAccount?.loginid ? (
                                    <div className='wallets-options-and-multipliers-listing__icon'>
                                        <LabelPairedChevronRightCaptionRegularIcon width={16} />
                                    </div>
                                ) : null
                            }
                        >
                            <div className='wallets-options-and-multipliers-listing__content__details'>
                                <WalletText size='sm'>
                                    <Trans defaults={title} />
                                </WalletText>
                                <WalletText size='xs'>
                                    <Trans defaults={description} />
                                </WalletText>
                            </div>
                        </TradingAccountCard>
                    );
                })}
            </div>
        </div>
    );
};

export default OptionsAndMultipliersListing;
