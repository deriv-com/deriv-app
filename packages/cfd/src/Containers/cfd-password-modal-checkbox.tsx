import React from 'react';
import { Text, Checkbox, StaticUrl } from '@deriv/components';
import { DBVI_COMPANY_NAMES } from '@deriv/shared';
import { Localize } from '@deriv/translations';

type CfdPasswordModalCheckboxProps = {
    is_checked: boolean;
    onCheck: () => void;
    jurisdiction_selected_shortcode: string;
};

const CfdPasswordModalCheckbox = ({
    is_checked,
    onCheck,
    jurisdiction_selected_shortcode,
}: CfdPasswordModalCheckboxProps) => {
    const getCheckboxLabel = () => (
        <Text as='p' size='xxs' line_height='s'>
            <Localize
                i18n_default_text='I confirm and accept {{company}} ’s <0>terms and conditions</0>'
                values={{ company: DBVI_COMPANY_NAMES[jurisdiction_selected_shortcode].name }}
                components={[
                    <StaticUrl
                        key={0}
                        href={DBVI_COMPANY_NAMES[jurisdiction_selected_shortcode].tnc_url}
                        is_document
                    />,
                ]}
            />
        </Text>
    );

    return (
        <div className='cfd-password-modal-checkbox'>
            <Checkbox value={is_checked} onChange={onCheck} label={getCheckboxLabel()} />
        </div>
    );
};

export default CfdPasswordModalCheckbox;
