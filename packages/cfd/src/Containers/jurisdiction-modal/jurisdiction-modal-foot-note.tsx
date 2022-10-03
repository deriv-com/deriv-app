import React from 'react';
import { Text } from '@deriv/components';
import { getAuthenticationStatusInfo } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TJurisdictionModalFootNoteProps } from '../props.types';

const FooterNote = ({
    account_status,
    account_type,
    jurisdiction_selected_shortcode,
    card_classname,
    should_restrict_bvi_account_creation,
}: TJurisdictionModalFootNoteProps) => {
    const {
        poi_or_poa_not_submitted,
        poi_pending_for_vanuatu,
        poi_verified_for_bvi_labuan_maltainvest,
        poi_pending_for_bvi_labuan_maltainvest,
        poi_verified_for_vanuatu,
        need_poi_for_vanuatu,
        poi_resubmit_for_bvi_labuan_maltainvest,
        poi_acknowledged_for_bvi_labuan_maltainvest,
        poa_acknowledged,
        poi_poa_verified_for_bvi_labuan_maltainvest,
        need_poa_resubmission,
        need_poi_for_bvi_labuan_maltainvest,
        poa_pending,
    } = getAuthenticationStatusInfo(account_status);

    const is_svg_type = jurisdiction_selected_shortcode === 'svg';
    const is_vanuatu_type = jurisdiction_selected_shortcode === 'vanuatu';
    const is_bvi_type = jurisdiction_selected_shortcode === 'bvi';
    const is_labuan_maltainvest_type = ['labuan', 'maltainvest'].includes(jurisdiction_selected_shortcode);
    const account_type_name = account_type === 'synthetic' ? 'Derived' : 'Financial';

    if (is_svg_type)
        return (
            <Localize
                i18n_default_text='Add your Deriv MT5 <0>{{account_type_name}}</0> account under Deriv (SVG) LLC (company no. 273 LLC 2020).'
                values={{ account_type_name }}
            />
        );
    else if (poi_or_poa_not_submitted && (is_vanuatu_type || is_bvi_type || is_labuan_maltainvest_type))
        return (
            <Localize i18n_default_text='To create this account first we need your proof of identity and address.' />
        );
    else if (is_bvi_type && should_restrict_bvi_account_creation) {
        return poa_pending ? (
            <Localize
                i18n_default_text='<0>You can open this account once your submitted documents have been verified.</0>'
                components={[<span key={0} className={`${card_classname}__footnote--pending`} />]}
            />
        ) : (
            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of address.' />
        );
    } else if (poi_verified_for_bvi_labuan_maltainvest && is_bvi_type)
        return (
            <Localize
                i18n_default_text='Add your Deriv MT5 <0>{{account_type_name}}</0>  account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114).'
                values={{ account_type_name }}
            />
        );
    else if (poi_verified_for_vanuatu && is_vanuatu_type)
        return (
            <Localize
                i18n_default_text='Add Your Deriv MT5 <0>{{account_type_name}}</0>  account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.'
                values={{ account_type_name }}
            />
        );
    else if (poi_poa_verified_for_bvi_labuan_maltainvest && jurisdiction_selected_shortcode === 'labuan')
        return (
            <Localize
                i18n_default_text='Add your Deriv MT5 <0>{{account_type_name}}</0>  STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (Licence no. MB/18/0024).'
                values={{ account_type_name }}
            />
        );
    else if (poi_poa_verified_for_bvi_labuan_maltainvest && jurisdiction_selected_shortcode === 'maltainvest')
        return (
            <Localize i18n_default_text='Add your Deriv MT5 CFDs account under Deriv Investments (Europe) Limited regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156).' />
        );
    else if (
        (is_vanuatu_type && poi_pending_for_vanuatu) ||
        (is_bvi_type && poi_pending_for_bvi_labuan_maltainvest) ||
        (is_labuan_maltainvest_type &&
            poi_acknowledged_for_bvi_labuan_maltainvest &&
            poa_acknowledged &&
            !poi_poa_verified_for_bvi_labuan_maltainvest)
    )
        return (
            <Localize
                i18n_default_text='<0>You can open this account once your submitted documents have been verified.</0>'
                components={[<span key={0} className={`${card_classname}__footnote--pending`} />]}
            />
        );
    else if (is_labuan_maltainvest_type && need_poa_resubmission && need_poi_for_bvi_labuan_maltainvest)
        return (
            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity and address.' />
        );
    else if (
        (is_vanuatu_type && need_poi_for_vanuatu) ||
        ((is_bvi_type || is_labuan_maltainvest_type) && poi_resubmit_for_bvi_labuan_maltainvest)
    )
        return (
            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity.' />
        );
    else if (is_labuan_maltainvest_type && need_poa_resubmission)
        return (
            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of address.' />
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
