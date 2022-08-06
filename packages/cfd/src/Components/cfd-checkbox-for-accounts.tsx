import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { Text, Checkbox, StaticUrl } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile, getIdentityStatusInfo } from '@deriv/shared';

import { GetAccountStatus } from '@deriv/api-types';

type TCfdCheckBoxForAccountsProps = {
    jurisdiction_selected_shortcode: string;
    onCheck: () => void;
    is_checked: boolean;
    account_status: GetAccountStatus;
    is_fully_authenticated: boolean;
    className: string;
};

const CfdCheckBoxForAccounts = ({
    onCheck,
    is_checked,
    jurisdiction_selected_shortcode,
    account_status,
    is_fully_authenticated,
    className,
}: TCfdCheckBoxForAccountsProps) => {
    const { poa_verified, poi_verified_for_labuan_bvi, poi_verified_for_vanuatu, poi_poa_verified } =
        getIdentityStatusInfo(account_status);

    const showCheckBox = () => {
        if (jurisdiction_selected_shortcode) {
            if (jurisdiction_selected_shortcode === 'svg') {
                return false;
            } else if (jurisdiction_selected_shortcode === 'vanuatu' && poa_verified && poi_verified_for_vanuatu) {
                return true;
            } else if (
                (jurisdiction_selected_shortcode === 'bvi' ||
                    jurisdiction_selected_shortcode === 'labuan' ||
                    jurisdiction_selected_shortcode === 'maltainvest') &&
                poa_verified &&
                poi_verified_for_labuan_bvi
            ) {
                return true;
            } else if (is_fully_authenticated && poi_poa_verified) return true;
            return false;
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
        <>
            {showCheckBox() && (
                <div className={className}>
                    <Checkbox onChange={onCheck} value={is_checked} label={getCheckboxLabel()} />
                </div>
            )}
        </>
    );
};
export default connect(({ modules, client }: RootStore) => ({
    jurisdiction_selected_shortcode: modules.cfd.jurisdiction_selected_shortcode,
    account_status: client.account_status,
    is_fully_authenticated: client.is_fully_authenticated,
}))(CfdCheckBoxForAccounts);
