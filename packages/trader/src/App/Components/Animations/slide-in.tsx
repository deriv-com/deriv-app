import React from 'react';
import posed, { PoseGroup } from 'react-pose';

type SlideInProps = {
    children: React.ReactNode;
    is_visible: boolean;
    keyname: string;
    type: string;
};

const SlideInFromTop = posed.div({
    enter: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 200,
        },
    },
    exit: {
        y: -20,
        opacity: 0,
        transition: {
            duration: 100,
        },
    },
});

const SlideInFromBottom = posed.div({
    enter: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 200,
        },
    },
    exit: {
        y: 20,
        opacity: 0,
        transition: {
            duration: 100,
        },
    },
});

const SlideIn = ({ children, className, keyname, is_visible, type }: SlideInProps) => {
    if (type === 'bottom') {
        return (
            <PoseGroup flipMove={false}>
                {is_visible && (
                    <SlideInFromBottom className={className} key={keyname}>
                        {children}
                    </SlideInFromBottom>
                )}
            </PoseGroup>
        );
    }
    return (
        <PoseGroup flipMove={false}>
            {is_visible && (
                <SlideInFromTop className={className} key={keyname}>
                    {children}
                </SlideInFromTop>
            )}
        </PoseGroup>
    );
};

export { SlideIn };
