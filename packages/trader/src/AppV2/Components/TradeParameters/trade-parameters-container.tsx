import React from 'react';
import { Localize } from '@deriv/translations';
import { CSSTransition } from 'react-transition-group';
import { HEIGHT } from 'AppV2/Utils/layout-utils';
import { Text } from '@deriv-com/quill-ui';
import Guide from '../Guide';

type TTradeParametersContainer = {
    chart_ref?: React.RefObject<HTMLDivElement>;
    is_minimized?: boolean;
};

const TradeParametersContainer = ({
    chart_ref,
    children,
    is_minimized,
}: React.PropsWithChildren<TTradeParametersContainer>) => {
    const [is_minimized_visible, setIsMinimizedVisible] = React.useState(false);

    const onScroll = React.useCallback(() => {
        const current_chart_ref = chart_ref?.current;

        if (current_chart_ref) {
            const chart_bottom_Y = current_chart_ref.getBoundingClientRect().bottom;
            const container_bottom_Y = window.innerHeight - HEIGHT.BOTTOM_NAV;
            if (chart_bottom_Y < container_bottom_Y) {
                setIsMinimizedVisible(true);
            } else {
                setIsMinimizedVisible(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_minimized_visible]);

    React.useEffect(() => {
        if (!is_minimized) return;

        const scroll_container = document.querySelector('.bottom-nav-selection');
        scroll_container?.addEventListener('scroll', onScroll);

        return () => scroll_container?.removeEventListener('scroll', onScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onScroll]);

    return (
        <React.Fragment>
            {is_minimized ? (
                <CSSTransition
                    in={is_minimized_visible}
                    timeout={0}
                    classNames={{
                        appear: 'trade-params__options__wrapper--minimized--enter',
                        enter: 'trade-params__options__wrapper--minimized--enter',
                        enterDone: 'trade-params__options__wrapper--minimized--enter-done',
                        exit: 'trade-params__options__wrapper--minimized--exit',
                    }}
                    unmountOnExit
                    onEntered={() => {
                        const scroll_container = document.querySelector('.bottom-nav-selection');
                        scroll_container?.scroll({ top: scroll_container?.scrollHeight, behavior: 'smooth' });
                    }}
                >
                    {children}
                </CSSTransition>
            ) : (
                <section className='trade-params'>
                    <div className='trade-params__title'>
                        <Text>
                            <Localize i18n_default_text='Set your trade' />
                        </Text>
                        <Guide has_label />
                    </div>
                    {children}
                </section>
            )}
        </React.Fragment>
    );
};

export default TradeParametersContainer;
