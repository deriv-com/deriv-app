import React from 'react';
import { Button } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

type TBuySellRowActionProps = {
    account_currency?: string;
    className?: string;
    eligibility_status: string[];
    is_buy_advert?: boolean;
    is_eligible?: boolean;
    onClick: () => void;
};

const BuySellRowAction = ({
    account_currency,
    className,
    eligibility_status,
    is_buy_advert,
    is_eligible,
    onClick,
}: TBuySellRowActionProps) => {
    const { showModal } = useModalManagerContext();
    const {
        ui: { is_desktop },
    } = useStore();
    const { general_store } = useStores();

    const getEligibilityStatus = () => {
        if (eligibility_status?.length === 1) {
            if (eligibility_status.includes('completion_rate')) {
                return 'Your completion rate is too low for this ad.';
            } else if (eligibility_status.includes('join_date')) {
                return "You've not used Deriv P2P long enough for this ad.";
            }
        }

        return "The advertiser has set conditions for this ad that you don't meet.";
    };

    const onUnavailableClick = () => {
        showModal({ key: 'ErrorModal', props: { error_message: getEligibilityStatus() } });
    };

    if (is_eligible) {
        if (is_buy_advert) {
            return (
                <Button
                    className={className}
                    is_disabled={general_store.is_barred}
                    onClick={onClick}
                    primary
                    small={is_desktop}
                >
                    <Localize
                        i18n_default_text='Buy {{ account_currency }}'
                        values={{
                            account_currency,
                        }}
                    />
                </Button>
            );
        }

        return (
            <Button is_disabled={general_store.is_barred} onClick={onClick} primary small={is_desktop}>
                <Localize
                    i18n_default_text='Sell {{ account_currency }}'
                    values={{
                        account_currency,
                    }}
                />
            </Button>
        );
    }

    return (
        <Button onClick={onUnavailableClick} secondary small={is_desktop}>
            <Localize i18n_default_text='Unavailable' />
        </Button>
    );
};

export default BuySellRowAction;
