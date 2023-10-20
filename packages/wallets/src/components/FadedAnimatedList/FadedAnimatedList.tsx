import React from 'react';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './FadedAnimatedList.scss';

type TProps = {
    children: JSX.Element[];
    className?: string;
};

const FadedAnimatedList: React.FC<TProps> = ({ children, className }) => {
    return (
        <TransitionGroup className={classNames('wallets-faded-animated-list', className)}>
            {children.map(child => {
                return (
                    <CSSTransition
                        appear
                        classNames='wallets-faded-animated-list__list-item'
                        key={child.key}
                        timeout={250}
                    >
                        <div className='wallets-faded-animated-list__list-item--display-grid'>{child}</div>
                    </CSSTransition>
                );
            })}
        </TransitionGroup>
    );
};

export default FadedAnimatedList;
