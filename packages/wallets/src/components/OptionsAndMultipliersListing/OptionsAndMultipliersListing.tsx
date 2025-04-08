import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useActiveLinkedToTradingAccount, useIsEuRegion } from '@deriv/api-v2';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { getOptionsAndMultipliersContent } from '../../constants/constants';
import useIsRtl from '../../hooks/useIsRtl';
import { TRoute } from '../../routes/Router';
import { WalletLink } from '../Base';
import { DerivAppsSection } from '../DerivAppsSection';
import { TradingAppCardLoader } from '../SkeletonLoader';
import { TradingAccountCard } from '../TradingAccountCard';
import LinkTitle from './LinkTitle';
import './OptionsAndMultipliersListing.scss';

const OptionsAndMultipliersListingContentLoader = () => {
    return (
        <>
            {Array.from({ length: 3 }).map((_, idx) => (
                <TradingAppCardLoader key={`wallets-carousel-loader-action-${idx}`} />
            ))}
        </>
    );
};

const OptionsAndMultipliersListingContent: React.FC<{ isEuRegion: boolean }> = ({ isEuRegion }) => {
    const { localize } = useTranslations();
    const isRtl = useIsRtl();
    const history = useHistory();
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();

    return (
        <>
            {getOptionsAndMultipliersContent(localize, isEuRegion).map(account => {
                const { availability, description, key, redirect, title } = account;
                if (availability === 'Non-EU' && isEuRegion) return;
                return (
                    <TradingAccountCard
                        {...account}
                        disabled={activeLinkedToTradingAccount?.is_disabled || !activeLinkedToTradingAccount?.loginid}
                        key={`trading-account-card-${title}`}
                        onClick={() => {
                            if (!activeLinkedToTradingAccount?.loginid) return;
                            account.isExternal ? window.open(redirect, '_blank') : history.push(redirect as TRoute);
                        }}
                    >
                        <TradingAccountCard.Icon>
                            <LinkTitle platform={key} />
                        </TradingAccountCard.Icon>
                        <TradingAccountCard.Section>
                            <TradingAccountCard.Content>
                                <Text align='start' size='sm'>
                                    {title}
                                </Text>
                                <Text align='start' size='xs'>
                                    {description}
                                </Text>
                            </TradingAccountCard.Content>
                            {activeLinkedToTradingAccount?.loginid && (
                                <TradingAccountCard.Button>
                                    {isRtl ? (
                                        <LabelPairedChevronLeftCaptionRegularIcon
                                            data-testid='dt_label_paired_chevron'
                                            width={16}
                                        />
                                    ) : (
                                        <LabelPairedChevronRightCaptionRegularIcon
                                            data-testid='dt_label_paired_chevron'
                                            width={16}
                                        />
                                    )}
                                </TradingAccountCard.Button>
                            )}
                        </TradingAccountCard.Section>
                    </TradingAccountCard>
                );
            })}
        </>
    );
};

const OptionsAndMultipliersListing = () => {
    const { isDesktop } = useDevice();
    const { data: isEuRegion, isLoading: isEuRegionLoading } = useIsEuRegion();
    const isLoading = isEuRegionLoading;

    const title = isEuRegion ? <Localize i18n_default_text='Multipliers' /> : <Localize i18n_default_text='Options' />;
    const subtitle = isEuRegion ? (
        <>
            <Localize i18n_default_text='Leverage your trading; risk only what you put in.' />{' '}
            <WalletLink staticUrl='/trade-types/options/digital-options/up-and-down/'>
                <Localize i18n_default_text='Learn more' />
            </WalletLink>
        </>
    ) : (
        <>
            <Localize i18n_default_text='Predict the market, profit if you’re right, risk only what you put in.' />{' '}
            <WalletLink staticUrl='/trade-types/options/digital-options/up-and-down/'>
                <Localize i18n_default_text='Learn more' />
            </WalletLink>
        </>
    );

    return (
        <div className='wallets-options-and-multipliers-listing'>
            <section className='wallets-options-and-multipliers-listing__header'>
                <div className='wallets-options-and-multipliers-listing__header-title'>
                    {isDesktop && (
                        <Text align='center' size='xl' weight='bold'>
                            {isLoading ? (
                                <div className='wallets-skeleton wallets-options-and-multipliers-listing__header-title__loader' />
                            ) : (
                                title
                            )}
                        </Text>
                    )}
                    <Text align='start' size={isDesktop ? 'md' : 'sm'}>
                        {isLoading ? (
                            <div className='wallets-skeleton wallets-options-and-multipliers-listing__header-subtitle__loader' />
                        ) : (
                            subtitle
                        )}
                    </Text>
                </div>
                {isLoading ? <TradingAppCardLoader /> : <DerivAppsSection />}
            </section>
            <div
                className={classNames('wallets-options-and-multipliers-listing__content', {
                    'wallets-options-and-multipliers-listing__content--eu': isEuRegion,
                })}
            >
                {isLoading ? (
                    <OptionsAndMultipliersListingContentLoader />
                ) : (
                    <OptionsAndMultipliersListingContent isEuRegion={isEuRegion} />
                )}
            </div>
        </div>
    );
};

export default OptionsAndMultipliersListing;
