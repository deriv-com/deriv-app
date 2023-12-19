import React from 'react';
import clsx from 'clsx';
import styles from './mock.module.scss';

const MockComponent = () => {
    return <div className={clsx(styles.title, styles.titleSize)}>MockComponent rendered</div>;
};

export default MockComponent;
