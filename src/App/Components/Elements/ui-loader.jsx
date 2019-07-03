import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const UILoader = ({ className, classNameBlock }) => {
    const block_class   = classNames(classNameBlock, 'block-ui');
    const loading_class = classNames('block-ui__loading', className);
    return (
        <div className={block_class}>
            <div className={loading_class}>
                <div className='block-ui__loading-spinner'>
                    <svg className='block-ui__loading-spinner-circular' viewBox='25 25 50 50'>
                        <circle className='block-ui__loading-spinner-path' cx='50' cy='50' r='20' fill='none' strokeWidth='4' strokeMiterlimit='10' />
                    </svg>
                </div>
            </div>
        </div>
    );
};

UILoader.propTypes = {
    className     : PropTypes.string,
    classNameBlock: PropTypes.string,
};

export default UILoader;
