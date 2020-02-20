import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const UiLoader = ({ className, classNameBlock }) => {
    const block_class = classNames(classNameBlock, 'dc-block-ui');
    const loading_class = classNames('dc-block-ui__loading', className);
    return (
        <div className={block_class}>
            <div className={loading_class}>
                <div className='dc-block-ui__loading-spinner'>
                    <svg className='dc-block-ui__loading-spinner-circular' viewBox='25 25 50 50'>
                        <circle
                            className='dc-block-ui__loading-spinner-path'
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

UiLoader.propTypes = {
    className: PropTypes.string,
    classNameBlock: PropTypes.string,
};

export default UiLoader;
