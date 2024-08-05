import React from 'react';
import { ActionSheet, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

const BarrierDescription = ({ isDays }: { isDays: boolean }) => {
    return (
        <ActionSheet.Content className='barrier-params__description-content'>
            {isDays ? (
                <Text>
                    <Localize i18n_default_text='The barrier will be fixed at the set price.' />
                </Text>
            ) : (
                <>
                    <div className='content-section'>
                        <Text bold>
                            <Localize i18n_default_text='Above spot:' />
                        </Text>
                        <Text>
                            <Localize i18n_default_text='The barrier will move relative to the current spot, maintaining a set distance above it.' />
                        </Text>
                    </div>
                    <div className='content-section'>
                        <Text bold>
                            <Localize i18n_default_text='Below spot:' />
                        </Text>
                        <Text>
                            <Localize i18n_default_text='The barrier will move relative to the current spot, maintaining a set distance below it.' />
                        </Text>
                    </div>
                    <div className='content-section'>
                        <Text bold>
                            <Localize i18n_default_text='Fixed price:' />
                        </Text>
                        <Text>
                            <Localize i18n_default_text='The barrier will be fixed at the set price.' />
                        </Text>
                    </div>
                </>
            )}
        </ActionSheet.Content>
    );
};

export default BarrierDescription;
