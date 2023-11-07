import React from 'react';
import { Checkbox, StaticUrl, Text } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { TJurisdictionCheckBoxProps } from '../props.types';
import { JURISDICTION } from '../../Helpers/cfd-config';

const JurisdictionCheckBox = observer(
    ({
        class_name,
        is_checked,
        jurisdiction_selected_shortcode,
        onCheck,
        should_restrict_bvi_account_creation,
        should_restrict_vanuatu_account_creation,
    }: TJurisdictionCheckBoxProps) => {
        const { ui } = useStore();
        const { is_mobile } = ui;

        const shouldShowCheckBox = () => {
            if (
                !jurisdiction_selected_shortcode ||
                jurisdiction_selected_shortcode === JURISDICTION.SVG ||
                (jurisdiction_selected_shortcode === JURISDICTION.BVI && should_restrict_bvi_account_creation) ||
                (jurisdiction_selected_shortcode === JURISDICTION.VANUATU && should_restrict_vanuatu_account_creation)
            ) {
                return false;
            }
            return true;
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
            <Text as='p' size={is_mobile ? 'xxs' : 'xs'} line_height='xs'>
                <Localize
                    i18n_default_text="I confirm and accept {{company}} 's <0>Terms and Conditions</0>"
                    values={{ company: dbvi_company_names[jurisdiction_selected_shortcode].name }}
                    components={[
                        <StaticUrl
                            key={0}
                            className='link--no-bold'
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
                        <Checkbox
                            value={is_checked}
                            onChange={onCheck}
                            label={getCheckboxLabel()}
                            defaultChecked={!!is_checked}
                        />
                    </div>
                )}
            </React.Fragment>
        );
    }
);

export default JurisdictionCheckBox;
