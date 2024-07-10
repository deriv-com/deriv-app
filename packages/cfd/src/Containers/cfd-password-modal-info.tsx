import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { DBVI_COMPANY_NAMES } from '@deriv/shared';

type CfdPasswordModalInfoProps = {
    jurisdiction_selected_shortcode: string;
    platform: string;
    product: string;
};

const CfdPasswordModalInfo = ({ jurisdiction_selected_shortcode, platform, product }: CfdPasswordModalInfoProps) => {
    return (
        <div className='cfd-password-modal-info'>
            <div className='cfd-password-modal-info__icon'>
                <Icon icon={'IcInfoLight'} />
            </div>
            <Text size='xxxs'>
                <Localize
                    i18n_default_text='You are adding your {{platform}} {{product}} account under {{company}}, regulated by the British Virgin Islands Financial Services Commission (licence no. SIBA/L/18/1114).'
                    values={{
                        platform,
                        product,
                        company: DBVI_COMPANY_NAMES[jurisdiction_selected_shortcode].name,
                    }}
                />
            </Text>
        </div>
    );
};

export default CfdPasswordModalInfo;
