import clsx from 'clsx';
import React from 'react';

type TSkeletonProps = {
    animated?: boolean;
    className?: string;
    height?: string;
    paragraph?: {
        gap?: string;
        rows: number;
        width?: string;
    };
    variant?: 'icon';
    width?: string;
};

export const VARIANT = {
    ICON: 'icon',
} as const;

const Skeleton = ({ animated = true, className, height, paragraph, width, variant }: TSkeletonProps) => {
    const getDefaultSize = () => (variant === VARIANT.ICON ? '32px' : '100%');

    const style: React.CSSProperties = {
        width: width ?? getDefaultSize(),
        height: height ?? getDefaultSize(),
    };

    if (paragraph?.rows) {
        return (
            <div className='skeleton-paragraph' style={{ gap: paragraph.gap ?? '8px' }}>
                {Array.from(new Array(paragraph.rows)).map((_, idx) => {
                    return (
                        <div
                            key={idx}
                            className={clsx(className, 'skeleton', animated && 'animated')}
                            style={{
                                width: idx === paragraph.rows - 1 ? '96px' : paragraph.width ?? style.width,
                                height: style.height,
                            }}
                        />
                    );
                })}
            </div>
        );
    }
    return <div className={clsx(className, 'skeleton', animated && 'animated')} style={style} />;
};

export default Skeleton;
