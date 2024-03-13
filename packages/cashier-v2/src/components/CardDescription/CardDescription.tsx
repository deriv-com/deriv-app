import React from 'react';
import { Text } from '@deriv-com/ui';
import { TIconTypes } from '../../types';
import styles from './CardDescription.module.scss';

type TProps = {
    description: string;
    icons: TIconTypes.TIcon[] | [];
    title: string;
    urls: { url?: string }[] | [];
};

const CardDescription: React.FC<TProps> = ({ description, icons, title, urls = [] }) => {
    return (
        <div className={styles.container}>
            <div className={styles['info-container']}>
                <Text as='p' size='sm' weight='bold'>
                    {title}
                </Text>
                {description && (
                    <Text as='p' size='sm'>
                        {description}
                    </Text>
                )}
                {urls.length > 0 && (
                    <div className={styles['urls-container']}>
                        {urls.map(({ url }) => {
                            return (
                                <Text
                                    as='a'
                                    className={styles.url}
                                    color='red'
                                    href={url}
                                    key={url}
                                    rel='noopener noreferrer'
                                    size='xs'
                                    target='_blank'
                                    weight='bold'
                                >
                                    {url}
                                </Text>
                            );
                        })}
                    </div>
                )}
            </div>
            {icons.length > 0 && (
                <div className={styles['icons-container']}>
                    {icons.map(({ icon: Icon, key }) => (
                        <Icon height={32} key={key} width={50} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CardDescription;
