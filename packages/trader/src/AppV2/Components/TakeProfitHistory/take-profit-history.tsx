import { Text, CaptionText, Pagination } from '@deriv-com/quill-ui';
import CardWrapper from '../CardWrapper';
import React, { useState } from 'react';
import clsx from 'classnames';

const TakeProfitHistory = ({ history }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(history.length / itemsPerPage);

    const handlePageChange = pagination => {
        setCurrentPage(pagination.currentPage - 1);
    };

    const currentItems = history.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <CardWrapper title='TP history' className='take-profit-history'>
            <div
                className={clsx('take-profit-history__table', {
                    'take-profit-history__table--fixed-height': history.length > itemsPerPage,
                })}
            >
                {currentItems.map((item, index: number) => (
                    <div key={index} className='take-profit-history__table-row'>
                        <div
                            className={clsx('take-profit-history__table-cell', 'take-profit-history__table-cell--left')}
                        >
                            <CaptionText size='sm'>{item.date}</CaptionText>
                            <CaptionText color='rgba(0, 0, 0, 0.48)'>{item.time}</CaptionText>
                        </div>
                        <div className='take-profit-history__table-cell'>
                            <Text size='sm'>{item.action}</Text>
                            <Text color='rgba(0, 0, 0, 0.48)' size='sm'>
                                {item.amount}
                            </Text>
                        </div>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <Pagination
                    contentLength={history.length}
                    contentPerPage={itemsPerPage}
                    hideChevron
                    onClickPagination={handlePageChange}
                    variant='bullet'
                />
            )}
        </CardWrapper>
    );
};

export default TakeProfitHistory;
