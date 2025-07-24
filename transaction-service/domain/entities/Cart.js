class Cart {
    constructor(userId) {
        this.items = [];
        this.userId = userId;
        this.totalPrice = 0;
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

                } else {
                    this.items.push({
                        id: event.payload.id,
                        price: event.payload.price
                    });
                }

                this.totalPrice += event.payload.price * event.payload.quantity;
                break;
            }
            case 'CartItemRemoved': {
                const itemIndex = this.items.findIndex(item => item.id === event.payload.id);
                if (itemIndex !== -1) {
                    const item = this.items[itemIndex];
                    this.totalPrice -= item.price * item.quantity;
                    this.items.splice(itemIndex, 1);
                    if (this.totalPrice < 0) this.totalPrice = 0;
                }
                break;
            }
            case 'CartCleared':
            case 'CartCheckedOut':
                this.items = [];
                this.totalPrice = 0;
                break;
        }
    }

    getAll(){
        return {
            userId: this.userId,
            items: this.items,
            totalPrice: this.totalPrice
        };
    }
}

module.exports = Cart;