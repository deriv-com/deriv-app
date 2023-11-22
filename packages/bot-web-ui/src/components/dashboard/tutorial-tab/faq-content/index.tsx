import React from 'react';
import { Accordion, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { TDescription } from '../config';
import { useDBotStore } from 'Stores/useDBotStore';

type TFAQContent = {
    faq_list: TFAQList[];
};

type TFAQList = {
    title: string;
    description: TDescription[];
};

const FAQ = ({ type, content, src, imageclass }: TDescription) => {
    if (type === 'image') return <img src={src} className={imageclass} />;
    const is_mobile = isMobile();

    return (
        <Text
            as='p'
            size={is_mobile ? 'xs' : 's'}
            line_height={is_mobile ? 'xl' : 'xxl'}
            className='faq__description'
            weight='normal'
            key={content}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

const scrollToElement = (wrapper_element: HTMLElement, offset: number) => {
    if (wrapper_element) {
        wrapper_element.scrollTo({
            top: offset,
            behavior: 'smooth',
        });
    }
};

const FAQContent = observer(({ faq_list }: TFAQContent) => {
    const { dashboard } = useDBotStore();
    const { active_tab_tutorials } = dashboard;

    const faq_wrapper_element = React.useRef<HTMLDivElement>(null);
    const timer_id = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleAccordionClick = () => {
        // Scroll to the top of the open accordion item.
        // Need timer to first close the accordion item then scroll the new item to top.
        timer_id.current = setTimeout(() => {
            const open_accordion_element: HTMLElement | null | undefined =
                faq_wrapper_element.current?.querySelector('.dc-accordion__item--open');
            const previous_sibling_element = open_accordion_element?.previousElementSibling as HTMLElement;
            if (faq_wrapper_element.current && open_accordion_element) {
                const offset = previous_sibling_element ? previous_sibling_element.offsetTop - 80 : 0;
                scrollToElement(faq_wrapper_element?.current, offset);
            }
            if (timer_id?.current) clearTimeout(timer_id.current);
        }, 5);
    };

    const handleKeyboardEvent = (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleAccordionClick();
    };

    React.useEffect(() => {
        return () => {
            if (timer_id.current) clearTimeout(timer_id.current);
        };
    }, []);

    const getList = () => {
        return faq_list.map(({ title, description }: TFAQList) => ({
            header: (
                <Text
                    as='p'
                    line_height='xl'
                    className='faq__title'
                    weight='bold'
                    key={title}
                    size={isMobile() ? 'xs' : 's'}
                >
                    {title}
                </Text>
            ),
            content: description?.map((item, index) => (
                <FAQ {...item} key={`faq-description-item-${item?.content}-${index}`} />
            )),
        }));
    };

    return (
        <div data-testid='id-faq__wrapper'>
            <div className='faq__wrapper' ref={faq_wrapper_element}>
                {faq_list?.length > 0 && (
                    <>
                        {active_tab_tutorials === 2 && (
                            <Text as='p' line_height='xl' className='faq__wrapper__header' weight='bold'>
                                <Localize i18n_default_text='FAQ' />
                            </Text>
                        )}
                        <div
                            data-testid='id-accordion-test'
                            onClick={handleAccordionClick}
                            onKeyDown={handleKeyboardEvent}
                        >
                            <Accordion className='faq__wrapper__content' list={getList()} icon_close='' icon_open='' />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

export default FAQContent;
