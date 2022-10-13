import React from 'react';
import { Text, Accordion } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { TDescription } from './tutorial-content';

type TFAQContent = {
    faq_list: TFAQList[];
    faq_search_value: string;
};

type TFAQList = {
    title: string;
    description: TDescription[];
};

const FAQ = ({ type, content, src }: TDescription) => {
    if (type === 'image') return <img src={src} />;

    return (
        <Text
            as='p'
            line_height='xxl'
            className='faq__description'
            weight='normal'
            key={content}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

const FAQContent = ({ faq_list, faq_search_value }: TFAQContent) => {
    const getList = () => {
        return faq_list.map(({ title, description }: TFAQList) => ({
            header: (
                <Text as='p' line_height='xl' className='faq__title' weight='bold' key={title}>
                    {title}
                </Text>
            ),
            content: description.map((item, index) => <FAQ {...item} key={`faq-description-item-${index}`} />),
        }));
    };

    return (
        <div>
            <div className='faq__wrapper'>
                <Text as='p' line_height='xl' className='faq__wrapper__header' weight='bold'>
                    {localize('FAQ')}
                </Text>
                {faq_list?.length ? (
                    <Accordion className='faq__wrapper__content' list={getList()} icon_close='' icon_open='' />
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
