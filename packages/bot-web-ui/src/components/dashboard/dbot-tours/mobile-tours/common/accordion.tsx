import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TStepMobile } from '../../config';

type TAccordion = {
    content_data: TStepMobile | null;
    expanded: boolean;
    test_id?: string;
};

const Accordion = ({ content_data, expanded = false, test_id = 'dbot-acc-id', ...props }: TAccordion) => {
    const [is_open, setOpen] = React.useState(expanded);
    if (!content_data) return null;
    const { content, header } = content_data;
    return (
        <div className='dbot-accordion' {...props}>
            <div>
                <div className='dbot-accordion__navbar' data-testid={test_id} onClick={() => setOpen(!is_open)}>
                    <div className='dbot-accordion__header'>
                        <Text as='span' size='xs' weight='bold'>
                            {localize(header)}
                        </Text>
                    </div>
                    <div className='dbot-accordion__icon'>
                        <Icon icon={is_open ? 'IcChevronDownBold' : 'IcChevronUpBold'} />
                    </div>
                </div>
                <div
                    className={classNames('dbot-accordion__content', {
                        'dbot-accordion__content--open': is_open,
                    })}
                    data-testid='accordion-content'
                >
                    {content}
                </div>
            </div>
        </div>
    );
};

export default Accordion;
