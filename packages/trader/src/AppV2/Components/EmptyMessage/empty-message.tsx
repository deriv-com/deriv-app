import React from 'react';
import { Button, Text } from '@deriv-com/quill-ui';
import { IllustrativeEtfIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

export type TEmptyMessageProps = {
    isClosedTab?: boolean;
    noMatchesFound?: boolean;
};

const EmptyMessage = ({ isClosedTab, noMatchesFound }: TEmptyMessageProps) => (
    <div className={`empty-message__${isClosedTab ? 'closed' : 'open'}`}>
        <div className='icon'>
            {/* The icon is not final, adding the correct one to quill-icons is being discussed. */}
            <IllustrativeEtfIcon iconSize='2xl' />
        </div>
        <div className='message'>
            <Text bold size='lg'>
                {noMatchesFound && <Localize i18n_default_text='No matches found' />}
                {!noMatchesFound &&
                    (isClosedTab ? (
                        <Localize i18n_default_text='No closed positions' />
                    ) : (
                        <Localize i18n_default_text='No open positions' />
                    ))}
            </Text>
            <Text size='sm' centered>
                {noMatchesFound && (
                    <Localize i18n_default_text='Try changing or removing filters to view available positions.' />
                )}
                {!noMatchesFound &&
                    (isClosedTab ? (
                        <Localize i18n_default_text='Your completed trades will appear here.' />
                    ) : (
                        <Localize i18n_default_text='Ready to open a position?' />
                    ))}
            </Text>
        </div>
        {!noMatchesFound && !isClosedTab && (
            <div className='button-container'>
                <Button
                    color='black'
                    variant='secondary'
                    fullWidth
                    size='md'
                    label={<Localize i18n_default_text='Start trading' />}
                />
            </div>
        )}
    </div>
);

export default EmptyMessage;
