import React from 'react';
import clsx from 'clsx';
import { qtMerge } from '@deriv/quill-design';
import { InlineMessage, useDevice } from '@deriv-com/ui';
import IcAlertAnnounce from '../../assets/status-message/ic-alert-announce.svg';
import { OnfidoCustomClass } from './OnfidoView.classnames';
import './OnfidoView.scss';

type TOnfidoView = {
    isOnfidoEnabled: boolean;
    isOnfidoInitialized: boolean;
    onfidoElementId: string;
    showStatusMessage: boolean;
};

export const OnfidoView = memo(
    ({ isOnfidoEnabled, isOnfidoInitialized, onfidoElementId, showStatusMessage }: TOnfidoView) => {
        const { isMobile } = useDevice();
        return (
            <div
                className={qtMerge(
                    'relative min-w-[328px] min-h-[500px] m-auto',
                    OnfidoCustomClass({ mobile: isMobile })
                )}
            >
                <div
                    className={clsx(
                        'absolute p-400 top-200 min-h-1700 text-center z-[1] w-full [transition:transform_0.35s_linear_4.65s] origin-top',
                        {
                            'scale-y-0': showStatusMessage,
                            invisible: !showStatusMessage,
                        }
                    )}
                >
                    <InlineMessage
                        className='bg-solid-green-1/200'
                        icon={<IcAlertAnnounce />}
                        type='filled'
                        variant='general'
                    >
                        Your personal details have been saved successfully.
                    </InlineMessage>
                </div>
                <section>
                    {isOnfidoInitialized && !isOnfidoEnabled && (
                        <div className='absolute top-800 -translate-x-1/2 left-1/2 z-[1] max-w-max w-full'>
                            <InlineMessage type='filled' variant='info'>
                                Hit the checkbox above to choose your document.
                            </InlineMessage>
                        </div>
                    )}
                    <div
                        className={clsx({
                            'opacity-600 pointer-events-none': !isOnfidoEnabled,
                            '[display:hidden]': !isOnfidoInitialized,
                        })}
                        id={onfidoElementId}
                    />
                </section>
            </div>
        );
    }
);
