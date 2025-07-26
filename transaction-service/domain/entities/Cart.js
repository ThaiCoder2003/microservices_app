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
                const existingItem = this.items.find(item => item.id === event.payload.id);
                if (existingItem) {
                    existingItem.quantity += event.payload.quantity;
                } else {
                    this.items.push({
                        id: event.payload.id,
                        quantity: event.payload.quantity
                    });
                }

                break;
            }
            case 'CartItemRemoved': {
                const itemIndex = this.items.findIndex(item => item.id === event.payload.id);
                if (itemIndex !== -1) {
                    this.items.splice(itemIndex, 1);
                }
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
}

module.exports = Cart;