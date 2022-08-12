import React from 'react';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import { GetAccountStatus } from '@deriv/api-types';
import { getIdentityStatusInfo } from '@deriv/shared';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TModalFootNoteProps = {
    account_status: GetAccountStatus;
    card_classname: string;
    account_type: string;
    jurisdiction_selected_shortcode: string;
};

const ModalFootNote = ({
    account_status,
    account_type,
    jurisdiction_selected_shortcode,
    card_classname,
}: TModalFootNoteProps) => {
    const {
        need_poi_for_vanuatu,
        need_poi_for_bvi_labuan_maltainvest,
        need_poa_resubmission,
        poa_acknowledged,
        poi_verified_for_vanuatu,
        poi_verified_for_bvi_labuan_maltainvest,
        poi_poa_verified_for_bvi_labuan_maltainvest,
        poi_poa_verified_for_vanuatu,
        poa_verified,
        poi_acknowledged_for_bvi_labuan_maltainvest,
        poi_acknowledged_for_vanuatu,
        poi_or_poa_not_submitted,
    } = getIdentityStatusInfo(account_status);

    const account_type_name = account_type === 'synthetic' ? 'Synthetics' : 'Financial';

    return (
        <>
            {jurisdiction_selected_shortcode === 'svg' && (
                <div className={`${card_classname}__footnote`}>
                    <Text as='p' color='prominent' weight='bold' align='center' size='xs' line_height='xs'>
                        <Localize
                            i18n_default_text='Add your DMT5 {{account_type}} account under Deriv (SVG) LLC (company no. 273 LLC 2020).'
                            values={{ account_type: account_type_name }}
                        />
                    </Text>
                </div>
            )}

            {poi_verified_for_bvi_labuan_maltainvest && poa_verified && jurisdiction_selected_shortcode === 'bvi' && (
                <div className={`${card_classname}__footnote`}>
                    <Text as='p' color='prominent' weight='bold' align='center' size='xs' line_height='xs'>
                        <Localize
                            i18n_default_text='Add your DMT5 {{account_type}} account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/{{line_break}}L/18/1114).'
                            values={{ account_type: account_type_name, line_break: '\n' }}
                        />
                    </Text>
                </div>
            )}
            {poi_verified_for_vanuatu && poa_verified && jurisdiction_selected_shortcode === 'vanuatu' && (
                <div className={`${card_classname}__footnote`}>
                    <Text as='p' color='prominent' weight='bold' align='center' size='xs' line_height='xs'>
                        <Localize
                            i18n_default_text='Add Your DMT5 {{account_type}} account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.'
                            values={{ account_type: account_type_name }}
                        />
                    </Text>
                </div>
            )}
            {poi_verified_for_bvi_labuan_maltainvest && poa_verified && jurisdiction_selected_shortcode === 'labuan' && (
                <div className={`${card_classname}__footnote`}>
                    <Text as='p' color='prominent' weight='bold' align='center' size='xs' line_height='xs'>
                        <Localize
                            i18n_default_text='Add your DMT5 {{account_type}} STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (Licence no. MB/18/0024).'
                            values={{ account_type: account_type_name }}
                        />
                    </Text>
                </div>
            )}
            {poi_poa_verified_for_bvi_labuan_maltainvest && jurisdiction_selected_shortcode === 'maltainvest' && (
                <div className={`${card_classname}__footnote`}>
                    <Text as='p' color='prominent' weight='bold' align='center' size='xs' line_height='xs'>
                        <Localize
                            i18n_default_text='Add your DMT5 CFDs account under Deriv Investments (Europe) Limited regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156).'
                            values={{ account_type: account_type_name }}
                        />
                    </Text>
                </div>
            )}
            {poi_or_poa_not_submitted && jurisdiction_selected_shortcode && jurisdiction_selected_shortcode !== 'svg' && (
                <Text
                    as='p'
                    color='prominent'
                    align='center'
                    size='xs'
                    weight='bold'
                    line_height='xs'
                    className={`${card_classname}__footnote`}
                >
                    <Localize i18n_default_text='To create this account first we need your proof of identity and address.' />
                </Text>
            )}

            {jurisdiction_selected_shortcode &&
                jurisdiction_selected_shortcode === 'vanuatu' &&
                need_poi_for_vanuatu &&
                poa_acknowledged &&
                !poi_or_poa_not_submitted && (
                    <Text
                        as='p'
                        color='prominent'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className={`${card_classname}__footnote`}
                    >
                        <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity.' />
                    </Text>
                )}
            {jurisdiction_selected_shortcode &&
                (jurisdiction_selected_shortcode === 'bvi' ||
                    jurisdiction_selected_shortcode === 'labuan' ||
                    jurisdiction_selected_shortcode === 'maltainvest') &&
                need_poi_for_bvi_labuan_maltainvest &&
                poa_acknowledged &&
                !poi_or_poa_not_submitted && (
                    <Text
                        as='p'
                        color='prominent'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className={`${card_classname}__footnote`}
                    >
                        <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity.' />
                    </Text>
                )}
            {need_poa_resubmission &&
                poi_acknowledged_for_vanuatu &&
                jurisdiction_selected_shortcode &&
                jurisdiction_selected_shortcode === 'vanuatu' && (
                    <Text
                        as='p'
                        color='prominent'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className={`${card_classname}__footnote`}
                    >
                        <Localize i18n_default_text='To create this account first we need you to resubmit your proof of address.' />
                    </Text>
                )}
            {need_poa_resubmission &&
                poi_acknowledged_for_bvi_labuan_maltainvest &&
                jurisdiction_selected_shortcode &&
                (jurisdiction_selected_shortcode === 'bvi' ||
                    jurisdiction_selected_shortcode === 'labuan' ||
                    jurisdiction_selected_shortcode === 'maltainvest') && (
                    <Text
                        as='p'
                        color='prominent'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className={`${card_classname}__footnote`}
                    >
                        <Localize i18n_default_text='To create this account first we need you to resubmit your proof of address.' />
                    </Text>
                )}

            {need_poa_resubmission &&
                jurisdiction_selected_shortcode &&
                jurisdiction_selected_shortcode === 'vanuatu' &&
                need_poi_for_vanuatu && (
                    <Text
                        as='p'
                        color='prominent'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className={`${card_classname}__footnote`}
                    >
                        <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity and address.' />
                    </Text>
                )}

            {need_poa_resubmission &&
                jurisdiction_selected_shortcode &&
                (jurisdiction_selected_shortcode === 'bvi' ||
                    jurisdiction_selected_shortcode === 'labuan' ||
                    jurisdiction_selected_shortcode === 'maltainvest') &&
                need_poi_for_bvi_labuan_maltainvest && (
                    <Text
                        as='p'
                        color='prominent'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className={`${card_classname}__footnote`}
                    >
                        <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity and address.' />
                    </Text>
                )}

            {poa_acknowledged &&
                poi_acknowledged_for_vanuatu &&
                !poi_poa_verified_for_vanuatu &&
                jurisdiction_selected_shortcode &&
                jurisdiction_selected_shortcode === 'vanuatu' && (
                    <div className={`${card_classname}__footnote--pending`}>
                        <Text as='p' align='center' color='yellow' weight='bold' size='xs' line_height='xs'>
                            <Localize i18n_default_text='You will be able to open this account once your submitted documents have been verified.' />
                        </Text>
                    </div>
                )}

            {poa_acknowledged &&
                poi_acknowledged_for_bvi_labuan_maltainvest &&
                !poi_poa_verified_for_bvi_labuan_maltainvest &&
                jurisdiction_selected_shortcode &&
                (jurisdiction_selected_shortcode === 'bvi' ||
                    jurisdiction_selected_shortcode === 'labuan' ||
                    jurisdiction_selected_shortcode === 'maltainvest') && (
                    <div className={`${card_classname}__footnote--pending`}>
                        <Text as='p' align='center' color='yellow' weight='bold' size='xs' line_height='xs'>
                            <Localize i18n_default_text='You will be able to open this account once your submitted documents have been verified.' />
                        </Text>
                    </div>
                )}
        </>
    );
};

export default connect(({ modules: { cfd }, client }: RootStore) => ({
    account_status: client.account_status,
    jurisdiction_selected_shortcode: cfd.jurisdiction_selected_shortcode,
}))(ModalFootNote);
