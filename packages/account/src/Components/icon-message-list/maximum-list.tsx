import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import ListItem from './list-item';
import { TMessage_list } from '../../Types';

const MaximumList = ({ message_list }: TMessage_list) => {
    const [show_more, setShowMore] = React.useState(false);
    const maximum_list = message_list.slice(0, 3);

    return show_more ? (
        <React.Fragment>
            {message_list.map(text => (
                <ListItem key={text} text={text} />
            ))}
            <Button
                type='button'
                className='account-management__list-button'
                onClick={() => setShowMore(false)}
                large
                tertiary
            >
                <Localize i18n_default_text='Show less' />
            </Button>
        </React.Fragment>
    ) : (
        <React.Fragment>
            {maximum_list.map(text => (
                <ListItem key={text} text={text} />
            ))}
            <Button
                type='button'
                className='account-management__list-button'
                onClick={() => setShowMore(true)}
                large
                tertiary
            >
                <Localize i18n_default_text='Show more' />
            </Button>
        </React.Fragment>
    );
};

export default MaximumList;
