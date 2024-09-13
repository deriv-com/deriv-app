import React from 'react';
import { ActionSheet, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

const BarrierDescription = ({ isDays }: { isDays: boolean }) => {
    return (
        <ActionSheet.Content className='barrier-params__description-content'>
            {isDays ? (
                <div className='content-section'>
                    <Text bold>
                        <Localize i18n_default_text='Fixed price:' />
                    </Text>
                    <Text>
                        <Localize i18n_default_text='Barrier set at specific price.' />
                    </Text>
                </div>
            ) : (
                <>
                    <div className='content-section'>
                        <Text bold>
                            <Localize i18n_default_text='Above spot:' />
                        </Text>
                        <Text>
                            <Localize i18n_default_text='Barrier set above spot price.' />
                        </Text>
                    </div>
                    <div className='content-section'>
                        <Text bold>
                            <Localize i18n_default_text='Below spot:' />
                        </Text>
                        <Text>
                            <Localize i18n_default_text='Barrier set below spot price.' />
                        </Text>
                    </div>
                    <div className='content-section'>
                        <Text bold>
                            <Localize i18n_default_text='Fixed price:' />
                        </Text>
                        <Text>
                            <Localize i18n_default_text='Barrier set at specific price.' />
                        </Text>
                    </div>
                </>
            )}
        </ActionSheet.Content>
    );
};

export default BarrierDescription;
