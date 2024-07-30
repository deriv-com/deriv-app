import React, { useCallback } from 'react';
import classNames from 'classnames';
import { Tooltip } from '@deriv-com/ui';
import { WalletText } from '../../../../../../../../components/Base';
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
    value: string;
    valueTextProps?: Omit<React.ComponentProps<typeof WalletText>, 'children'>;
};

const TransactionsPendingRowField: React.FC<TProps> = ({ className, hint, name, value, valueTextProps }) => {
    const { isMobile } = useDevice();
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
                                  text: 'View',
                              },
                          ]
                        : []
                }
                description={hint?.text}
                title='Transaction details'
            />,
            { defaultRootId: 'wallets_modal_root' }
        );
    }, [hint, show]);

    return (
        <div className={classNames('wallets-transactions-pending-row-field', className)} key={name}>
            <WalletText color='primary' size='xs'>
                {name}
            </WalletText>
            {hint ? (
                <Tooltip
                    as='div'
                    hideTooltip={isMobile}
                    tooltipContent={hint.text}
                    tooltipPosition={hint.tooltipAlignment}
                >
                    <WalletText {...{ color: 'red', size: 'xs', weight: 'bold', ...valueTextProps }}>
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
                    </WalletText>
                </Tooltip>
            ) : (
                <WalletText color='red' size='xs' weight='bold' {...valueTextProps}>
                    {value}
                </WalletText>
            )}
        </div>
    );
};

export default TransactionsPendingRowField;
