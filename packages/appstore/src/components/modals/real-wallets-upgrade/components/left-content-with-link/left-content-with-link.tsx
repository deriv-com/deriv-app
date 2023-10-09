import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { TitleText } from '../title-text';
import './left-content-with-link.scss';

const LeftContentWithLink = observer(({ children }: { children: Array<JSX.Element> }) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const [show_fork, setShowFork] = React.useState(false);

    React.useEffect(() => {
        if (children?.length !== undefined) setShowFork(children.length > 1);
    }, [children]);

    return (
        <div className='left-content-with-link'>
            <div className='left-content-with-link__content'>
                <React.Fragment>
                    {is_mobile && (
                        <TitleText className='wallet-link-wrapper__heading wallet-link-wrapper__heading--top'>
                            <Localize i18n_default_text='Your current trading account(s)' />
                        </TitleText>
                    )}
                    {children}
                </React.Fragment>
            </div>
            <div className='left-content-with-link__link'>
                {(show_fork || is_mobile) && <div className='left-content-with-link__link-fork' />}
                <div
                    className={classNames('left-content-with-link__link-neck', {
                        'left-content-with-link__link-neck--show-fork': show_fork && !is_mobile,
                    })}
                />
            </div>
        </div>
    );
});

export default LeftContentWithLink;
