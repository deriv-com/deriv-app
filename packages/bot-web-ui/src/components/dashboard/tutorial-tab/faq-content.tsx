import React, { useEffect } from 'react';
import { Accordion, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { TDescription } from './tutorial-content';

type TFAQContent = {
    faq_list: TFAQList[];
    hide_header?: boolean;
};

type TFAQList = {
    title: string;
    description: TDescription[];
};

const FAQ = ({ type, content, src }: TDescription) => {
    if (type === 'image') return <img src={src} />;
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

const FAQContent = observer(({ faq_list, hide_header = false }: TFAQContent) => {
    const { dashboard } = useDBotStore();

    const { faq_search_value } = dashboard;

    const timer_id = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleAccordionClick = () => {
        // Scroll to the top of the open accordion item. Need timer to first close the accordion item then scroll the new item to top.
        timer_id.current = setTimeout(() => {
            const faqWrapper = document?.querySelector('.faq__wrapper');
            const openAccordionItem: HTMLElement | null = document?.querySelector('.dc-accordion__item--open');
            const previousSibling = openAccordionItem?.previousElementSibling as HTMLElement;

            if (openAccordionItem && previousSibling) {
                faqWrapper?.scrollTo({
                    top: previousSibling.offsetTop - 80,
                    behavior: 'smooth',
                });
            } else if (openAccordionItem) {
                faqWrapper?.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }

            if (timer_id?.current) clearTimeout(timer_id.current);
        }, 5);
    };

    useEffect(() => {
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
            content: description.map((item, index) => (
                <FAQ {...item} key={`faq-description-item-${item?.content}-${index}`} />
            )),
        }));
    };

    return (
        <div>
            <div className='faq__wrapper'>
                {!hide_header && (
                    <Text as='p' line_height='xl' className='faq__wrapper__header' weight='bold'>
                        {localize('FAQ')}
                    </Text>
                )}
                {faq_list?.length ? (
                    <div onClick={handleAccordionClick}>
                        <Accordion className='faq__wrapper__content' list={getList()} icon_close='' icon_open='' />
                    </div>
                ) : (
                    <div className='faq__wrapper__nosearch'>
                        <Text as='h1' weight='bold' line_height='xxs'>
                            {localize('No results found "{{ faq_search_value }}"', {
                                faq_search_value,
                            })}
                        </Text>
                    </div>
                )}
            </div>
        </div>
    );
});

export default FAQContent;
