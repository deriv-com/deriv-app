import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { StandaloneBriefcaseFillIcon, StandaloneSearchFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

export type TEmptyPositionsProps = {
    isClosedTab?: boolean;
    noMatchesFound?: boolean;
};

const EmptyPositions = ({ isClosedTab, noMatchesFound }: TEmptyPositionsProps) => {
    const Icon = noMatchesFound ? StandaloneSearchFillIcon : StandaloneBriefcaseFillIcon;

    return (
        <div className={`empty-positions__${isClosedTab ? 'closed' : 'open'}`}>
            <div className='icon' data-testid='dt_empty_state_icon'>
                <Icon iconSize='2xl' />
            </div>
            <div className='message'>
                <Text bold size='lg' color='quill-typography__color--subtle'>
                    {noMatchesFound && <Localize i18n_default_text='No matches found' />}
                    {!noMatchesFound &&
                        (isClosedTab ? (
                            <Localize i18n_default_text='No closed trades' />
                        ) : (
                            <Localize i18n_default_text='No open trades' />
                        ))}
                </Text>
                <Text size='sm' centered color='quill-typography__color--subtle'>
                    {noMatchesFound && (
                        <Localize i18n_default_text='Try changing or removing filters to view available positions.' />
                    )}
                    {!noMatchesFound &&
                        (isClosedTab ? (
                            <Localize i18n_default_text='Your closed trades will be shown here.' />
                        ) : (
                            <Localize i18n_default_text='Your open trades will appear here.' />
                        ))}
                </Text>
            </div>
        </div>
    );
};

export default EmptyPositions;
