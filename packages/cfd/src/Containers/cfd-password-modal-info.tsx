import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { DBVI_COMPANY_NAMES } from '@deriv/shared';
import { useIsSelectedMT5AccountCreated } from '@deriv/hooks';

type CfdPasswordModalInfoProps = {
    jurisdiction_selected_shortcode: string;
    platform: string;
    product: string;
    need_tnc: boolean;
};

const CfdPasswordModalInfo = ({
    jurisdiction_selected_shortcode,
    platform,
    product,
    need_tnc,
}: CfdPasswordModalInfoProps) => {
    const { selected_mt5_account } = useIsSelectedMT5AccountCreated();
    return (
        <div className='cfd-password-modal-info'>
            <div className='cfd-password-modal-info__icon'>
                <Icon icon='IcInfoLight' />
            </div>
            <Text size='xxxs'>
                {need_tnc ? (
                    <Localize
                        i18n_default_text='You are adding your {{platform}} {{product}} account under {{company}}, regulated by the {{licence_name}}.'
                        values={{
                            platform,
                            product,
                            company: selected_mt5_account.name,
                            licence_name: DBVI_COMPANY_NAMES[jurisdiction_selected_shortcode].licence_name,
                        }}
                    />
                ) : (
                    <Localize
                        i18n_default_text='You are adding your {{platform}} {{product}} account under {{licence_name}}.'
                        values={{
                            platform,
                            product,
                            licence_name: DBVI_COMPANY_NAMES[jurisdiction_selected_shortcode].licence_name,
                        }}
                    />
                )}
            </Text>
        </div>
    );
};

export default CfdPasswordModalInfo;
