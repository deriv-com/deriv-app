import {
    observable,
    action,
    runInAction,
    computed }      from 'mobx';
import ShopifyBuy   from 'shopify-buy';
import { localize } from 'deriv-translations/lib/i18n';

export default class ShopStore {
    shopify                    = null;
    enabled_collection_handles = [
        'complete-strategies',
        'collection-strategies',
    ];

    @observable is_open     = false;
    @observable collections = [];

    constructor(root_store) {
        this.root_store = root_store;
    }

    @computed
    get is_loading() {
        return this.collections.length === 0;
    }

    @action.bound
    onMount() {
        this.shopify = ShopifyBuy.buildClient({
            domain               : 'dbotstrategies-fe.myshopify.com',
            storefrontAccessToken: '989a5497a72ae9acb3e272c70ec4d26d',
        });

        this.retrieveShopCollections();
    }

    @action.bound
    toggleShopModal() {
        this.is_open = !this.is_open;
    }

    @action.bound
    retrieveShopCollections() {
        this.shopify.collection.fetchAllWithProducts().then(collections => {
            runInAction(() => {
                const is_valid_collection = (collection) =>
                    this.enabled_collection_handles.includes(collection.handle) || collection.products.length > 0;

                this.collections = collections
                    .filter(is_valid_collection)
                    .map(collection => {
                        return {
                            id      : collection.id,
                            title   : collection.title,
                            products: collection.products.map(product => {
                                const product_obj = {
                                    id             : product.id,
                                    title          : product.title,
                                    description    : product.description,
                                    is_loading     : false,
                                    vendor         : product.vendor,
                                    onClickPurchase: () => this.checkoutProduct(product),
                                };
            
                                const { priceV2 } = product.variants[0];
            
                                if (Number.parseFloat(priceV2.amount) === 0) {
                                    product_obj.price = localize('Free');
                                } else {
                                    product_obj.price = `${priceV2.amount} ${priceV2.currencyCode}`;
                                }
            
                                if (product.images.length > 0) {
                                    product_obj.thumbnail = {
                                        src: product.images[0].src,
                                        alt: product.images[0].altText,
                                    };
                                }
            
                                return product_obj;
                            }),
                        };
                    });
            });
        });
    }

    @action.bound
    checkoutProduct(product) {
        // We will show a loading indicator on this product's button while we prepare the checkout
        let existing_product;

        this.collections.some((collection) => {
            return collection.products.some((p) => {
                if (p.id === product.id) {
                    existing_product = p;
                    return true;
                }

                return false;
            });
        });

        const setPurchaseButtonLoading = (is_loading) => {
            existing_product.is_loading = is_loading;

            runInAction(() => {
                this.collections = this.collections.slice();
            });
        };

        setPurchaseButtonLoading(true);

        this.shopify.checkout.create().then(checkout => {
            // We assume that there's only one variant of a strategy, hence index is always 0.
            const line_items = [{ variantId: product.variants[0].id, quantity: 1 }];

            this.shopify.checkout.addLineItems(checkout.id, line_items)
                .then(updated_checkout => {
                    window.open(updated_checkout.webUrl, '_blank');
                    setPurchaseButtonLoading(false);
                })
                .catch(() => {
                    setPurchaseButtonLoading(false);
                });
        });
        
    }
}
