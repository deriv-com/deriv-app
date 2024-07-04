import clsx from 'clsx';
import React from 'react';

type TSkeletonProps = {
    animated?: boolean;
    className?: string;
    rows?: number;
    variant?: typeof VARIANT[keyof typeof VARIANT];
} & React.CSSProperties;

export const VARIANT = {
    ICON: 'icon',
    PARAGRAPH: 'paragraph',
} as const;

const Skeleton = ({
    animated = true,
    className,
    gap,
    height,
    rows,
    width,
    variant,
    ...css_properties
}: TSkeletonProps) => {
    if (VARIANT.PARAGRAPH && rows) {
        return (
            <div className='skeleton-paragraph' style={{ gap: gap ?? 8 }}>
                {Array.from(new Array(rows)).map((_, idx) => {
                    return (
                        <div
                            key={idx}
                            className={clsx(className, 'skeleton', animated && 'animated')}
                            style={{
                                width: idx === rows - 1 ? 96 : width,
                                height,
                            }}
                        />
                    );
                })}
            </div>
        );
    }
    return (
        <div
            className={clsx(className, 'skeleton', animated && 'animated', variant)}
            style={{ width, height, ...css_properties }}
        />
    );
};

export default Skeleton;
