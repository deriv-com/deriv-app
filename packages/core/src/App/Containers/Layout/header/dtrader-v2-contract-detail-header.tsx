import React from 'react';
import { observer } from '@deriv/stores';
import { Text } from '@deriv-com/quill-ui';
import { LabelPairedArrowLeftSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router-dom';

const DTraderContractDetailsHeader = observer(() => {
    const history = useHistory();

    return (
        <header className='header contract-details-header-v2'>
            <React.Suspense fallback={<div />}>
                <LabelPairedArrowLeftSmBoldIcon
                    height='22px'
                    width='13px'
                    className='arrow'
                    data-testid='arrow'
                    onClick={() => history.goBack()}
                />
                <Text size='md' bold>
                    <Localize i18n_default_text='Contract Details' />
                </Text>
            </React.Suspense>
        </header>
    );
});

export default DTraderContractDetailsHeader;
