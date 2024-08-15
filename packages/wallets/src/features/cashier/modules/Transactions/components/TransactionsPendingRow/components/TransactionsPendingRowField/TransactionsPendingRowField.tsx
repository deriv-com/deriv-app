import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useTranslations } from '@deriv-com/translations';
import { Text, Tooltip } from '@deriv-com/ui';
import { useModal } from '../../../../../../../../components/ModalProvider';
import useDevice from '../../../../../../../../hooks/useDevice';
import { WalletActionModal } from '../../../../../../components/WalletActionModal';
import './TransactionsPendingRowField.scss';

type TProps = {
    className?: classNames.ArgumentArray[number];
    hint?: {
        link?: string;
        text: string;
        tooltipAlignment?: React.ComponentProps<typeof Tooltip>['tooltipPosition'];
    };
    name: string;
    value: JSX.Element | string;
    valueTextProps?: Omit<React.ComponentProps<typeof Text>, 'children'>;
};

const TransactionsPendingRowField: React.FC<TProps> = ({ className, hint, name, value, valueTextProps }) => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();
    const { show } = useModal();

    const onValueClick = useCallback(() => {
        show(
            <WalletActionModal
                actionButtonsOptions={
                    hint?.link
                        ? [
                              {
                                  isPrimary: true,
                                  onClick: () => window.open(hint?.link),
                                  text: localize('View'),
                              },
                          ]
                        : []
                }
                description={hint?.text}
                title={localize('Transaction details')}
            />,
            { defaultRootId: 'wallets_modal_root' }
        );
    }, [hint?.link, hint?.text, localize, show]);

    return (
        <div className={classNames('wallets-transactions-pending-row-field', className)} key={name}>
            <Text color='primary' size='xs'>
                {name}
            </Text>
            {hint ? (
                <Tooltip
                    as='div'
                    hideTooltip={isMobile}
                    tooltipContent={hint.text}
                    tooltipPosition={hint.tooltipAlignment}
                >
                    <Text {...{ color: 'red', size: 'xs', weight: 'bold', ...valueTextProps }}>
                        {isMobile ? (
                            <button className='wallets-transactions-pending-row-field__button' onClick={onValueClick}>
                                {value}
                            </button>
                        ) : (
                            <a
                                className='wallets-transactions-pending-row-field__link'
                                href={hint.link}
                                rel='noopener noreferrer'
                                target='_blank'
                            >
                                {value}
                            </a>
                        )}
                    </Text>
                </Tooltip>
            ) : (
                <Text color='red' size='xs' weight='bold' {...valueTextProps}>
                    {value}
                </Text>
            )}
        </div>
    );
};

export default TransactionsPendingRowField;
