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
    const need_tnc = jurisdiction_selected_shortcode !== 'svg'; //TODO: check for default jurisdiction project

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
                            company: DBVI_COMPANY_NAMES[jurisdiction_selected_shortcode].name,
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
