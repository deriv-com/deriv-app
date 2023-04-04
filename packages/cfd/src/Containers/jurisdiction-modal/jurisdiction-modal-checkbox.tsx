import React from 'react';
import { Checkbox, StaticUrl, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TJurisdictionCheckBoxProps } from '../props.types';

const JurisdictionCheckBox = ({
    class_name,
    is_checked,
    jurisdiction_selected_shortcode,
    onCheck,
    context,
    should_restrict_bvi_account_creation,
}: TJurisdictionCheckBoxProps) => {
    const shouldShowCheckBox = () => {
        if (jurisdiction_selected_shortcode) {
            if (
                jurisdiction_selected_shortcode === 'svg' ||
                (jurisdiction_selected_shortcode === 'bvi' && should_restrict_bvi_account_creation)
            ) {
                return false;
            }
            return true;
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
        <Text as='p' align='center' size={isMobile() ? 'xxs' : 'xs'} line_height='xs'>
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
                        context={context}
                        value={is_checked}
                        onChange={onCheck}
                        label={getCheckboxLabel()}
                        defaultChecked={!!is_checked}
                    />
                </div>
            )}
        </React.Fragment>
    );
};

export default JurisdictionCheckBox;
