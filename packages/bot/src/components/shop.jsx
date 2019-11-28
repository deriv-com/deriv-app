import {
    Button,
    Loading,
    ThemedScrollbars,
}                  from 'deriv-components';
import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from '../stores/connect';
import '../assets/sass/shop.scss';

class Shop extends React.PureComponent {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        const {
            collections,
            is_loading,
        } = this.props;

        return (
            <React.Fragment>
                { is_loading && <Loading is_fullscreen={false} /> }
                { !is_loading &&
                    <ThemedScrollbars
                        style={{ width: '100%', height: '100%' }}
                        autoHide
                    >
                        { collections.map(collection => {
                            return (
                                <div className='shop__collection' key={collection.id}>
                                    <div className='shop__title'>{ collection.title }</div>
                                    <div className='shop__products'>
                                        { collection.products.map(product => {
                                            return (
                                                <div
                                                    className='shop__product'
                                                    key={product.id}
                                                >
                                                    { product.thumbnail &&
                                                        <img
                                                            className='shop__product-thumbnail'
                                                            alt={product.thumbnail.alt}
                                                            src={product.thumbnail.src}
                                                        />
                                                    }
                                                    <div className='shop__product-title'>{product.title}</div>
                                                    <div className='shop__product-vendor'>{ product.vendor }</div>
                                                    <div className='shop__product-description'>{ product.description }</div>
                                                    <div className='shop__product-purchase-button'>
                                                        <Button
                                                            type='button'
                                                            text={product.price}
                                                            onClick={product.onClickPurchase}
                                                            primary
                                                            is_loading={product.is_loading}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        }) }
                                    </div>
                                </div>
                            );
                        }) }
                    </ThemedScrollbars>
                }
            </React.Fragment>
        );
    }
}

Shop.propTypes = {
    checkoutProduct: PropTypes.func,
    collections    : PropTypes.array,
    is_loading     : PropTypes.bool,
    onMount        : PropTypes.func,
};

export default connect(({ shop }) => ({
    collections    : shop.collections,
    checkoutProduct: shop.checkoutProduct,
    is_loading     : shop.is_loading,
    onMount        : shop.onMount,
}))(Shop);
