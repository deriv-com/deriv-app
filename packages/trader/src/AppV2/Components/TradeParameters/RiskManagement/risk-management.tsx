import React from 'react';
import clsx from 'clsx';
import { TextField } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';

type TRiskManagementProps = {
    is_minimized?: boolean;
};

const RiskManagement = ({ is_minimized }: TRiskManagementProps) => {
    return (
        <TextField
            variant='fill'
            readOnly
            label={
                <Localize
                    i18n_default_text='Risk Management'
                    key={`risk-management${is_minimized ? '-minimized' : ''}`}
                />
            }
            value={localize('Not set')}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
        />
    );
};

export default RiskManagement;
