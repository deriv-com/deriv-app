import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { LabelPairedChevronRightSmBoldIcon, LabelPairedCircleInfoSmRegularIcon } from '@deriv/quill-icons';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

import './positions-banner.scss';

const BODY_CLASS = 'has-positions-banner';
const HEIGHT_CSS_VAR = '--positions-banner-height';

const PositionsBanner = observer(() => {
    const { pathname } = useLocation();
    const history = useHistory();
    const { isDesktop } = useDevice();
    const {
        client: { is_logged_in },
    } = useStore();
    const banner_ref = React.useRef<HTMLDivElement>(null);

    const is_trader_route = pathname === routes.trade || pathname.startsWith(`${routes.trade}/`);
    const should_render = is_trader_route && is_logged_in;

    React.useEffect(() => {
        if (!should_render) return;

        document.body.classList.add(BODY_CLASS);

        const updateHeight = () => {
            if (!banner_ref.current) return;
            document.body.style.setProperty(HEIGHT_CSS_VAR, `${banner_ref.current.offsetHeight}px`);
        };

        updateHeight();

        // Recalculate when the banner reflows (viewport resize, font load, etc.)
        const observer = new ResizeObserver(updateHeight);
        if (banner_ref.current) observer.observe(banner_ref.current);

        return () => {
            observer.disconnect();
            document.body.classList.remove(BODY_CLASS);
            document.body.style.removeProperty(HEIGHT_CSS_VAR);
        };
    }, [should_render]);

    if (!should_render) return null;

    const handleReviewClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // The core history is strictly typed to a route-literal union; positions is a string route.
        history.push(routes.positions as unknown as Parameters<typeof history.push>[0]);
    };

    const handleMobileClick = () => {
        history.push(routes.trader_positions as unknown as Parameters<typeof history.push>[0]);
    };

    if (!isDesktop) {
        return (
            <button
                ref={banner_ref as unknown as React.RefObject<HTMLButtonElement>}
                type='button'
                className='positions-banner positions-banner--mobile'
                onClick={handleMobileClick}
                aria-label='Review open positions before upgrade'
            >
                <LabelPairedCircleInfoSmRegularIcon
                    className='positions-banner__icon'
                    fill='var(--component-textIcon-normal-prominent)'
                />
                <span className='positions-banner__text positions-banner__text--mobile'>
                    <Localize i18n_default_text='System is upgrading. Close positions by 13 June.' />
                </span>
                <LabelPairedChevronRightSmBoldIcon
                    className='positions-banner__chevron'
                    fill='var(--component-textIcon-normal-prominent)'
                />
            </button>
        );
    }

    return (
        <div ref={banner_ref} className='positions-banner' role='status' aria-live='polite'>
            <LabelPairedCircleInfoSmRegularIcon
                className='positions-banner__icon'
                fill='var(--component-textIcon-normal-default)'
            />
            <span className='positions-banner__text'>
                <Localize
                    i18n_default_text="We're upgrading Deriv Trader on 13 June at 06:00 UTC. Any open positions will be automatically closed at this time, so please <0>review and close yours</0> beforehand. You'll be able to open new positions after the upgrade."
                    components={[
                        <a
                            key={0}
                            href={routes.positions}
                            onClick={handleReviewClick}
                            className='positions-banner__link'
                        />,
                    ]}
                />
            </span>
        </div>
    );
});

export default PositionsBanner;
