import React from 'react';
import { Text, Checkbox, StaticUrl } from '@deriv/components';
import { isMobile, getAuthenticationStatusInfo } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TJurisdictionCheckBoxProps } from '../props.types';

const JurisdictionCheckBox = ({
    account_status,
    class_name,
    is_checked,
    jurisdiction_selected_shortcode,
    onCheck,
    should_restrict_bvi_account_creation,
}: TJurisdictionCheckBoxProps) => {
    const {
        poi_verified_for_bvi_labuan_maltainvest,
        poi_verified_for_vanuatu,
        poa_not_submitted,
        poi_poa_verified_for_bvi_labuan_maltainvest,
    } = getAuthenticationStatusInfo(account_status);

    const shouldShowCheckBox = () => {
        if (jurisdiction_selected_shortcode) {
            if (jurisdiction_selected_shortcode === 'svg') {
                return false;
            } else if (
                jurisdiction_selected_shortcode === 'vanuatu' &&
                poi_verified_for_vanuatu &&
                !poa_not_submitted
            ) {
                return true;
            } else if (
                jurisdiction_selected_shortcode === 'bvi' &&
                !should_restrict_bvi_account_creation &&
                poi_verified_for_bvi_labuan_maltainvest &&
                !poa_not_submitted
            ) {
                return true;
            } else if (
                ['labuan', 'maltainvest'].includes(jurisdiction_selected_shortcode) &&
                poi_poa_verified_for_bvi_labuan_maltainvest
            ) {
                return true;
            }
        }
        return false;
    };

    const dbvi_company_names: { [key: string]: { [key: string]: string } } = {
        bvi: { name: 'Deriv (BVI) Ltd', tnc_url: 'tnc/deriv-(bvi)-ltd.pdf' },
        labuan: { name: 'Deriv (FX) Ltd', tnc_url: 'tnc/deriv-(fx)-ltd.pdf' },
        maltainvest: {
            name: 'Deriv Investments (Europe) Limited',
            tnc_url: 'tnc/deriv-investments-(europe)-limited.pdf',
        },
        vanuatu: { name: 'Deriv (V) Ltd', tnc_url: 'tnc/general-terms.pdf' },
    };

    const getCheckboxLabel = () => (
        <Text as='p' align={!isMobile() ? 'center' : ''} size='xs' line_height='xs'>
            <Localize
                i18n_default_text="I confirm and accept {{company}} 's <0>Terms and Conditions</0>"
                values={{ company: dbvi_company_names[jurisdiction_selected_shortcode].name }}
                components={[
                    <StaticUrl
                        key={0}
                        className='link'
                        href={dbvi_company_names[jurisdiction_selected_shortcode].tnc_url}
                    />,
                ]}
            />
        </Text>
    );
    return (
        <React.Fragment>
            {shouldShowCheckBox() && (
                <div className={class_name}>
                    <Checkbox onChange={onCheck} value={is_checked} label={getCheckboxLabel()} />
                </div>
            )}
        </React.Fragment>
    );
};

export default JurisdictionCheckBox;
