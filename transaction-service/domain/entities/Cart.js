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
        switch (event.type) {
            case 'CartItemAdded': {
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
            case 'CartItemRemoved': {
                this.items = this.items.filter(item => item.productId !== event.payload.productId);
                break;
            }
            case 'CartCleared': {
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