//TODO: Below component will be removed once deriv-com/ui form-progress is ready
import React, { memo, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { TStep } from 'types';
import { Text, useDevice } from '@deriv-com/ui';
import './FormProgress.scss';

type TFormProgress = {
    currentStep: number;
    steps: TStep[];
    subSectionIndex?: number;
};

const FormProgress = ({ currentStep, steps = [], subSectionIndex = 0 }: TFormProgress) => {
    const { isDesktop } = useDevice();
    useEffect(() => {
        animateCompleteBar();
    });

    const elCompletedBar = useRef<HTMLDivElement | null>(null);

    const animateCompleteBar = () => {
        const subStepsCount = steps[currentStep]?.subStepCount || null;
        const elFirstIdentifier = (document.querySelector('.p2p-v2-identifier') as HTMLSpanElement) || {
            clientWidth: 1,
            offsetLeft: 0,
        };
        const each = 100 / steps.length;
        const subDivisions = subStepsCount ? Math.ceil(each / subStepsCount) : 0;
        if (elCompletedBar.current) {
            elCompletedBar.current.style.width = `${currentStep * each + subSectionIndex * subDivisions}%`;
            elCompletedBar.current.style.transform = `translateX(${
                elFirstIdentifier.offsetLeft + elFirstIdentifier.clientWidth / 2
            }px)`;
        }
    };

    let active = false;

    return (
        <>
            {isDesktop ? (
                <div className='p2p-v2-form-progress'>
                    <div className='p2p-v2-form-progress__header'>
                        <div className='p2p-v2-form-progress__steps'>
                            <div
                                className='p2p-v2-form-progress__steps--before'
                                style={{
                                    width: `calc(100% * ${steps.length - 1} / ${steps.length})`,
                                }}
                            />
                            {steps.map((item, idx) => (
                                <div key={item.header.title}>
                                    {(active = idx === currentStep)}
                                    <div className='p2p-v2-form-progress__step'>
                                        <Text
                                            align='center'
                                            className={clsx('p2p-v2-identifier', {
                                                'p2p-v2-identifier--active': idx <= currentStep,
                                            })}
                                            color='white'
                                            size='xs'
                                            weight='bold'
                                        >
                                            {idx + 1}
                                        </Text>
                                        <Text
                                            align='center'
                                            as='p'
                                            color={active ? 'error' : 'prominent'}
                                            size='xs'
                                            weight={active ? 'bold' : 'unset'}
                                        >
                                            {item.header.title}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                            <div className='p2p-v2-form-progress__steps--after' ref={elCompletedBar} />
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className='p2p-v2-form-progress__steps--after' ref={elCompletedBar} />
                    <div className='p2p-v2-form-progress--initial' />
                </div>
            )}
        </>
    );
};

export default memo(FormProgress);
