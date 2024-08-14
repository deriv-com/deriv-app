import { ReactNode, Fragment } from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv-com/translations';
import './article.scss';
import clsx from 'clsx';

export type TArticle = {
    title: JSX.Element | string;
    descriptions: Array<ReactNode>;
    onClickLearnMore?: () => void;
    className?: string;
};

const Article = ({ title, descriptions, onClickLearnMore, className }: TArticle) => {
    const has_descriptions: boolean = descriptions?.length > 0;
    const has_single_description: boolean = descriptions?.length === 1;

    return (
        <article className={clsx('da-article', className)}>
            <Text as='h4' color='prominent' line_height='m' size='xs' weight='bold' className='da-article__header'>
                {title}
            </Text>
            {has_descriptions && (
                <Fragment>
                    {has_single_description ? (
                        <Text as='p' size='xxs' line_height='m'>
                            {descriptions[0]}
                        </Text>
                    ) : (
                        <ul className='da-article__list'>
                            {descriptions.map((description, idx) => (
                                <li key={idx}>
                                    <Text size='xxs' line_height='xs'>
                                        {description}
                                    </Text>
                                </li>
                            ))}
                        </ul>
                    )}
                </Fragment>
            )}
            {onClickLearnMore && (
                <div className='da-article__learn-more' onClick={onClickLearnMore}>
                    <Text size='xxs' color='loss-danger' line_height='s'>
                        <Localize i18n_default_text='Learn more' />
                    </Text>
                    <Icon icon='IcChevronRight' className='da-article__learn-more-icon' color='red' />
                </div>
            )}
        </article>
    );
};

export default Article;
