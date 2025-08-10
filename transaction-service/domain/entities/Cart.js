const { CartEventTypes } = require('../events/cartEvents')
class Cart {
    constructor(userId) {
        this.items = [];
        this.userId = userId;
    }

    applyEvents(events) {
        for (const event of events) {
            this.apply(event);
        }
    }

    apply(event) {
        if (!event.payload || !event.payload.productId) return;
        switch (event.type) {
            case CartEventTypes.ITEM_ADDED: {
                const existingItem = this.items.find(item => item.productId === event.payload.productId);
                if (existingItem) {
                    existingItem.quantity += event.payload.quantity;
                } else {
                    this.items.push({
                        productId: event.payload.productId,
                        quantity: event.payload.quantity
                    });
                }

                break;
            }
            case CartEventTypes.ITEM_REMOVED: {
                this.items = this.items.filter(item => item.productId !== event.payload.productId);
                break;
            }
            case CartEventTypes.CART_CLEARED: {
                this.items = [];
                break;
            }
        }
    }

    getAll(){
        return {
            userId: this.userId,
            items: this.items,
        };
    }

    getTotalQuantity() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

module.exports = Cart;