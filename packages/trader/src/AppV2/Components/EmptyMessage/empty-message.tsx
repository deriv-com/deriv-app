import React from 'react';
import { Button, Text } from '@deriv-com/quill-ui';
import { IllustrativeEtfIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

export type TEmptyMessageProps = {
    isClosedTab?: boolean;
    noMatchesFound?: boolean;
    onRedirectToTrade?: () => void;
};

const EmptyMessage = ({ isClosedTab, onRedirectToTrade, noMatchesFound }: TEmptyMessageProps) => (
    <div className={`empty-message__${isClosedTab ? 'closed' : 'open'}`}>
        <div className='icon' data-testid='dt_empty_state_icon'>
            {/* The icon is not final, adding the correct one to quill-icons is being discussed. */}
            <IllustrativeEtfIcon iconSize='2xl' />
        </div>
        <div className='message'>
            {/* There is an issue with tokens: the 'lg' size should give 18px but it's giving 20px, it's being discussed. */}
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
                {/* There is an issue with tokens: the Button has a border width of 1.5px. The tokens in quill-ui will be updated, and it will change to the correct 1px. */}
                <Button
                    color='black'
                    fullWidth
                    onClick={onRedirectToTrade}
                    label={<Localize i18n_default_text='Start trading' />}
                    size='md'
                    variant='secondary'
                />
            </div>
        )}
    </div>
);

export default EmptyMessage;
