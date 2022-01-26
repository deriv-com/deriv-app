import React from 'react';
import posed, { PoseGroup } from 'react-pose';

type BounceProps = {
    children: React.ReactNode;
    is_visible: boolean;
    keyname: string;
};

const BounceUp = posed.div({
    enter: {
        y: 0,
        opacity: 1,
        transition: {
            y: {
                type: 'spring',
                stiffness: 500,
                damping: 15,
            },
            default: {
                duration: 300,
            },
        },
    },
    exit: {
        y: 35,
        opacity: 0,
        transition: {
            duration: 0,
        },
    },
});

const Bounce = ({ children, className, is_visible, keyname }: BounceProps) =>
    is_visible ? (
        <PoseGroup>
            <BounceUp className={className} key={keyname}>
                {children}
            </BounceUp>
        </PoseGroup>
    ) : null;

export { Bounce };
