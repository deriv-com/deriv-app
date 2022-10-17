import React from 'react';
import classNames from 'classnames';

type TUILoader = {
    className?: string;
    classNameBlock?: string;
};
const UILoader = ({ className, classNameBlock }: TUILoader) => {
    const block_class = classNames(classNameBlock, 'block-ui');
    const loading_class = classNames('block-ui__loading', className);
    return (
        <div className={block_class}>
            <div className={loading_class}>
                <div className='block-ui__loading-spinner'>
                    <svg className='block-ui__loading-spinner-circular' viewBox='25 25 50 50'>
                        <circle
                            className='block-ui__loading-spinner-path'
                            cx='50'
                            cy='50'
                            r='20'
                            fill='none'
                            strokeWidth='4'
                            strokeMiterlimit='10'
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default UILoader;
