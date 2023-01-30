import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getAuthenticationStatusInfo } from '@deriv/shared';
import { TJurisdictionModalFootNoteProps } from '../props.types';

const FooterNote = ({
    account_status,
    account_type,
    context,
    card_classname,
    jurisdiction_selected_shortcode,
    should_restrict_bvi_account_creation,
}: TJurisdictionModalFootNoteProps) => {
    const account_type_name = account_type === 'synthetic' ? 'Derived' : 'Financial';

    const { poa_pending } = getAuthenticationStatusInfo(account_status);

    if (jurisdiction_selected_shortcode === 'svg') {
        return (
            <Localize
                i18n_default_text='Add your Deriv MT5 <0>{{account_type_name}}</0> account under Deriv (SVG) LLC (company no. 273 LLC 2020).'
                values={{ account_type_name }}
            />
        );
    } else if (jurisdiction_selected_shortcode === 'bvi') {
        if (should_restrict_bvi_account_creation) {
            return poa_pending ? (
                <Localize
                    i18n_default_text='<0>You can open this account once your submitted documents have been verified.</0>'
                    components={[<span key={0} className={`${card_classname}__footnote--pending`} />]}
                />
            ) : (
                <Localize i18n_default_text='To create this account first we need you to resubmit your proof of address.' />
            );
        }
        return (
            <Localize
                i18n_default_text='Add your Deriv MT5 <0>{{account_type_name}}</0>  account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114).'
                values={{ account_type_name }}
            />
        );
    } else if (jurisdiction_selected_shortcode === 'vanuatu')
        return (
            <Localize
                i18n_default_text='Add Your Deriv MT5 <0>{{account_type_name}}</0>  account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.'
                values={{ account_type_name }}
            />
        );
    else if (jurisdiction_selected_shortcode === 'labuan')
        return (
            <Localize
                i18n_default_text='Add your Deriv MT5 <0>{{account_type_name}}</0>  STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (Licence no. MB/18/0024).'
                values={{ account_type_name }}
            />
        );
    else if (jurisdiction_selected_shortcode === 'maltainvest')
        return (
            <Localize i18n_default_text='Add your Deriv MT5 CFDs account under Deriv Investments (Europe) Limited regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156).' />
        );

    return null;
};

const JurisdictionModalFootNote = (props: TJurisdictionModalFootNoteProps) => {
    return (
        <div className={`${props.card_classname}__footnote`}>
            <Text as='p' color='prominent' align='center' size='xs' weight='bold' line_height='xs'>
                <FooterNote {...props} />
            </Text>
        </div>
    );
};

export default JurisdictionModalFootNote;
