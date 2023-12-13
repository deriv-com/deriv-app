import React, { useState } from 'react';
import classNames from 'classnames';

import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

import { TStepMobile } from '../config';

type TPartialAccordion = Partial<{
    test_id: string;
    icon: {
        open_icon: string;
        close_icon: string;
    };
    is_cursive: boolean;
    no_collapsible: boolean;
    expanded_subtitles_storage: { [key: string]: boolean };
    setExpandedSubtitlesStorage: (value: { [key: string]: boolean }) => void;
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
    const [is_open, setOpen] = useState(expanded);
    const {
        quick_strategy: { selected_strategy },
    } = useDBotStore();
    if (!content_data) return null;
    const { content, header } = content_data;

    const { expanded_subtitles_storage, setExpandedSubtitlesStorage } = props;
    const accordion_subtitle = `${header}__${selected_strategy}`.split(' ').join('_').toLocaleLowerCase();
    const is_expanded_section = expanded_subtitles_storage ? expanded_subtitles_storage[accordion_subtitle] : false;
    const should_be_expanded = is_expanded_section || is_open;

    const chooseIcon = () => {
        if (icon) {
            if (should_be_expanded) {
                return icon.open_icon || 'IcAccordionMinus';
            }
            return icon.close_icon || 'IcAccordionPlus';
        }
        return should_be_expanded ? 'IcAccordionMinus' : 'IcAccordionPlus';
    };

    return (
        <div className='dbot-accordion' {...props}>
            <div>
                <button
                    className={classNames('dbot-accordion__navbar', {
                        'dbot-accordion__navbar--no-event': !no_collapsible,
                    })}
                    data-testid={test_id}
                    onClick={() => {
                        setOpen(!should_be_expanded);
                        if (expanded_subtitles_storage && setExpandedSubtitlesStorage) {
                            setExpandedSubtitlesStorage({
                                ...expanded_subtitles_storage,
                                [accordion_subtitle]: !should_be_expanded,
                            });
                        }
                    }}
                >
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
                            <Icon icon={chooseIcon()} />
                        </div>
                    )}
                </button>
                <div
                    className={classNames('dbot-accordion__content', {
                        'dbot-accordion__content--open': should_be_expanded,
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
