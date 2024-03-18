import React from 'react';
import { twMerge } from 'tailwind-merge';
import { InlineMessage, useDevice } from '@deriv-com/ui';
import IcAlertAnnounce from '../../assets/status-message/ic-alert-announce.svg';
import { onfidoCustomClassVariant, onfidoInfoMessageVariant } from './OnfidoView.classnames';

type TOnfidoView = {
    isOnfidoEnabled: boolean;
    isOnfidoInitialized: boolean;
    onfidoElementId: string;
    showStatusMessage: boolean;
};

export const OnfidoView = ({
    isOnfidoEnabled,
    isOnfidoInitialized,
    onfidoElementId,
    showStatusMessage,
}: TOnfidoView) => {
    const { isMobile } = useDevice();
    return (
        <div
            className={twMerge(
                'relative min-w-[328px] min-h-[500px] m-auto',
                onfidoCustomClassVariant({ mobile: isMobile })
            )}
        >
            <div className={onfidoInfoMessageVariant({ showStatusMessage })}>
                <InlineMessage icon={<IcAlertAnnounce />} type='filled' variant='success'>
                    Your personal details have been saved successfully.
                </InlineMessage>
            </div>
            <section>
                {isOnfidoInitialized && !isOnfidoEnabled && (
                    <div className='absolute top-16 -translate-x-1/2 left-1/2 z-[1] max-w-max w-full'>
                        <InlineMessage type='filled' variant='info'>
                            Hit the checkbox above to choose your document.
                        </InlineMessage>
                    </div>
                )}
                <div
                    className={twMerge(
                        !isOnfidoInitialized && 'hidden',
                        !isOnfidoEnabled && 'opacity-48 pointer-events-none'
                    )}
                    data-testid='dt_onfido_element'
                    id={onfidoElementId}
                />
            </section>
        </div>
    );
};
