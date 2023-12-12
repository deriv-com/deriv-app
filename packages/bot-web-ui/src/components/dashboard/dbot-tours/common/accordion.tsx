import React from 'react';
import classNames from 'classnames';

import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

import { TStepMobile } from '../config';

type TPartialAccordion = Partial<{
    test_id: string;
    icon: {
        open_icon: string;
        close_icon: string;
    };
    is_cursive: boolean;
    no_collapsible: boolean;
}>;

type TAccordion = {
    content_data: TStepMobile | null;
    expanded: boolean;
} & TPartialAccordion;

const Accordion = ({
    content_data,
    expanded = false,
    test_id = 'dbot-acc-id',
    is_cursive = false,
    no_collapsible = true,
    icon,
    ...props
}: TAccordion) => {
    const [is_open, setOpen] = React.useState(expanded);
    if (!content_data) return null;
    const { content, header } = content_data;
    return (
        <div className='dbot-accordion' {...props}>
            <div>
                <div className='dbot-accordion__navbar' data-testid={test_id} onClick={() => setOpen(!is_open)}>
                    <div
                        className={classNames('dbot-accordion__header', {
                            'dbot-accordion__header--cursive': is_cursive,
                        })}
                    >
                        <Text as='span' size='xs' weight='bold'>
                            {localize(header)}
                        </Text>
                    </div>
                    {no_collapsible && (
                        <div className='dbot-accordion__icon'>
                            <Icon
                                icon={
                                    icon && is_open
                                        ? icon.open_icon || 'IcAccordionMinus'
                                        : icon
                                        ? icon.close_icon
                                        : 'IcAccordionPlus'
                                }
                            />
                        </div>
                    )}
                </div>
                <div
                    className={classNames('dbot-accordion__content', {
                        'dbot-accordion__content--open': is_open,
                    })}
                    data-testid='accordion-content'
                >
                    <Text as='span' line_height='s' size='xxs'>
                        {content}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default Accordion;
