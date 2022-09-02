import React from 'react';
import { Text } from '@deriv/components';
import { getAuthenticationStatusInfo } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TJurisdictionModalFootNoteProps } from '../props.types';

const JurisdictionModalFootNote = ({
    account_status,
    account_type,
    jurisdiction_selected_shortcode,
    card_classname,
}: TJurisdictionModalFootNoteProps) => {
    const {
        poi_or_poa_not_submitted,
        poi_pending_for_vanuatu,
        poi_verified_for_bvi_labuan_maltainvest,
        poi_pending_for_bvi_labuan_maltainvest,
        poi_verified_for_vanuatu,
        poi_not_submitted_for_vanuatu,
    } = getAuthenticationStatusInfo(account_status);

    const account_type_name = account_type && (account_type === 'synthetic' ? 'Synthetics' : 'Financial');

    const is_svg_type = jurisdiction_selected_shortcode && jurisdiction_selected_shortcode === 'svg';
    const is_vanuatu_type = jurisdiction_selected_shortcode && jurisdiction_selected_shortcode === 'vanuatu';
    const is_bvi_labuan_maltainvest_type =
        jurisdiction_selected_shortcode && ['bvi', 'labuan', 'maltainvest'].includes(jurisdiction_selected_shortcode);

    const FooterNote = () => {
        if (is_svg_type)
            return (
                <Localize
                    i18n_default_text='Add your DMT5 {{account_type}} account under Deriv (SVG) LLC (company no. 273 LLC 2020).'
                    values={{ account_type: account_type_name }}
                />
            );
        else if (poi_verified_for_bvi_labuan_maltainvest && jurisdiction_selected_shortcode === 'bvi')
            return (
                <Localize
                    i18n_default_text='Add your DMT5 {{account_type}} account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/{{line_break}}L/18/1114).'
                    values={{ account_type: account_type_name, line_break: '\n' }}
                />
            );
        else if (poi_verified_for_vanuatu && is_vanuatu_type)
            return (
                <Localize
                    i18n_default_text='Add Your DMT5 {{account_type}} account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.'
                    values={{ account_type: account_type_name }}
                />
            );
        else if (poi_verified_for_bvi_labuan_maltainvest && jurisdiction_selected_shortcode === 'labuan')
            return (
                <Localize
                    i18n_default_text='Add your DMT5 {{account_type}} STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (Licence no. MB/18/0024).'
                    values={{ account_type: account_type_name }}
                />
            );
        else if (poi_verified_for_bvi_labuan_maltainvest && jurisdiction_selected_shortcode === 'maltainvest')
            return (
                <Localize
                    i18n_default_text='Add your DMT5 CFDs account under Deriv Investments (Europe) Limited regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156).'
                    values={{ account_type: account_type_name }}
                />
            );
        else if (poi_or_poa_not_submitted && (is_vanuatu_type || is_bvi_labuan_maltainvest_type))
            return (
                <Localize i18n_default_text='To create this account first we need your proof of identity and address.' />
            );
        else if (is_vanuatu_type && poi_not_submitted_for_vanuatu)
            return (
                <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity.' />
            );
        else if (
            (is_vanuatu_type && poi_pending_for_vanuatu) ||
            (is_bvi_labuan_maltainvest_type && poi_pending_for_bvi_labuan_maltainvest)
        )
            return (
                <Localize
                    i18n_default_text='<0>You can open this account once your submitted documents have been verified.</0>'
                    components={[<span key={0} className={`${card_classname}__footnote--pending`} />]}
                />
            );
        return null;
    };

    return (
        <div className={`${card_classname}__footnote`}>
            <Text as='p' color='prominent' align='center' size='xs' weight='bold' line_height='xs'>
                <FooterNote />
            </Text>
        </div>
    );
};

export default JurisdictionModalFootNote;
