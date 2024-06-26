import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Text } from '@deriv-com/quill-ui';
import { LabelPairedArrowLeftSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import { useHistory, useLocation } from 'react-router-dom';
import { isEmptyObject } from '@deriv/shared';

const DTraderContractDetailsHeader = observer(() => {
    const { state } = useLocation();
    const history = useHistory();
    const { common } = useStore();
    const { routeBackInApp } = common;

    const handleBack = () => {
        const is_from_table_row = !isEmptyObject(state) ? state.from_table_row : false;
        return is_from_table_row
            ? history.goBack()
            : routeBackInApp(history as unknown as Parameters<typeof routeBackInApp>[0]);
    };

    return (
        <header className='header contract-details-header-v2'>
            <React.Suspense fallback={<div />}>
                <LabelPairedArrowLeftSmBoldIcon
                    height='22px'
                    width='13px'
                    className='arrow'
                    data-testid='arrow'
                    onClick={handleBack}
                />
                <Text size='md' bold>
                    <Localize i18n_default_text='Contract Details' />
                </Text>
            </React.Suspense>
        </header>
    );
});

export default DTraderContractDetailsHeader;
