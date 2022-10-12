import React from 'react';
import { Text, Accordion } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

type TFAQItem = {
    type: string;
    content: string;
    index: number;
    src?: string;
};

type TFAQ = {
    item: TFAQItem;
};

type TFAQContent = {
    faq_list: string[];
    faq_search_value: string;
};

type TFAQList = {
    title: string;
    description: { [key: string]: string }[];
};

const FAQ = ({ item }: TFAQ) => {
    const { type, content, index } = item;
    if (type === 'image') {
        return <img src={item.src} />;
    }
    return (
        <Text
            as='p'
            line_height='xxl'
            className='faq__description'
            weight='normal'
            key={index}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

const FAQContent = ({ faq_list, faq_search_value }: TFAQContent) => {
    const faqList = ({ title, description }: TFAQList) => {
        return {
            header: (
                <Text as='p' line_height='xl' className='faq__title' weight='bold' key={title}>
                    {title}
                </Text>
            ),
            content: description.map(item => <FAQ item={item} key={title} />),
        };
    };
    return (
        <div>
            <div className='faq__wrapper'>
                <Text as='p' line_height='xl' className='faq__wrapper__header' weight='bold'>
                    {localize('FAQ')}
                </Text>
                {faq_list?.length ? (
                    <Accordion
                        className='faq__wrapper__content'
                        list={faq_list.map(faqList)}
                        icon_close=''
                        icon_open=''
                    />
                ) : (
                    <Text as='h1' weight='bold' line_height='xxs'>
                        {localize('No results found "{{ faq_search_value }}"', {
                            faq_search_value,
                        })}
                    </Text>
                )}
            </div>
        </div>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    faq_search_value: dashboard.faq_search_value,
}))(FAQContent);
