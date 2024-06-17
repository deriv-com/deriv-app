import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { TAccountInfoDTraderV2 } from './account-actions-dtrader-v2';
import AccountInfoWrapper from '../account-info-wrapper';
import AccountSwitcherDTraderV2 from './account-switcher-dtrader-v2';
import { LabelPairedChevronDownCaptionRegularIcon, LabelPairedLockCaptionRegularIcon } from '@deriv/quill-icons';
import { CaptionText, Heading, ActionSheet } from '@deriv-com/quill-ui';
import { getAccountIcon } from './Utils/account-switcher-dtrader-v2-utils';

const AccountInfoDTraderV2 = ({
    acc_switcher_disabled_message,
    balance,
    currency,
    is_dialog_on,
    is_virtual,
    toggleDialog,
    is_disabled,
    account_switcher_title,
}: TAccountInfoDTraderV2) => (
    <React.Fragment>
        <AccountInfoWrapper
            is_disabled={is_disabled}
            disabled_message={acc_switcher_disabled_message}
            is_mobile
            is_dtrader_v2
        >
            <button className='header-v2__acc-info__wrapper' onClick={is_disabled ? undefined : () => toggleDialog()}>
                {getAccountIcon(currency, !!is_virtual, 'md')}
                <div className='header-v2__acc-info'>
                    {account_switcher_title ? (
                        <div className='header-v2__acc-info__name'>
                            <CaptionText color='quill-typography__color--default'>{account_switcher_title}</CaptionText>
                            {is_disabled ? (
                                <LabelPairedLockCaptionRegularIcon />
                            ) : (
                                <LabelPairedChevronDownCaptionRegularIcon
                                    className={classNames('header-v2__acc-info__select-arrow', {
                                        'header-v2__acc-info__select-arrow--up': is_dialog_on,
                                    })}
                                />
                            )}
                        </div>
                    ) : (
                        <div className='header-v2__acc-info--loader' />
                    )}
                    {(balance ?? !currency) && (
                        <Heading.H5 className='header-v2__acc-info__balance'>
                            {/* TODO: case without currency is taken from current production. No design */}
                            {!currency ? (
                                <Localize i18n_default_text='No currency assigned' />
                            ) : (
                                `${balance} ${getCurrencyDisplayCode(currency)}`
                            )}
                        </Heading.H5>
                    )}
                </div>
            </button>
        </AccountInfoWrapper>
        <ActionSheet.Root isOpen={is_dialog_on} onClose={() => toggleDialog(false)} position='left'>
            <ActionSheet.Portal shouldCloseOnDrag>
                <ActionSheet.Content>
                    <AccountSwitcherDTraderV2 is_visible />
                </ActionSheet.Content>
            </ActionSheet.Portal>
        </ActionSheet.Root>
    </React.Fragment>
);

export default AccountInfoDTraderV2;
