import React from 'react';
import { Accordion, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { TDescription } from './tutorial-content';

type TFAQContent = {
    faq_list: TFAQList[];
    faq_search_value: string;
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

const FAQContent = ({ faq_list, faq_search_value, hide_header = false }: TFAQContent) => {
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
            content: description.map(item => <FAQ {...item} key={`faq-description-item-${item}`} />),
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
                    <Accordion className='faq__wrapper__content' list={getList()} icon_close='' icon_open='' />
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
};

export default connect(({ dashboard }: RootStore) => ({
    faq_search_value: dashboard.faq_search_value,
}))(FAQContent);
