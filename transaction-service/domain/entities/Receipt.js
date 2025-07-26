class Receipt {
    constructor(userId) {
        this.userId = userId;
        this.receipts = [];
    }

    applyEvents(events) {
        for (const event of events) {
            this.apply(event);
        }
    }

    apply(event) {
        switch (event.type){
            case 'PurchaseCompleted':
                this.userId = event.userId;
                const items = event.payload.items;
                const totalPrice = event.payload.totalPrice;
                const timestamp = event.timestamp;
                const receipt = {
                    items: items,
                    totalPrice: totalPrice,
                    timestamp: timestamp
                }
                this.receipts.push(receipt); 
                break;
            default:
                console.warn(`Unknown event type: ${event.type}`);
        }
    }

    getAll() {
        return {
            userId: this.userId,
            receipts: this.receipts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        }
    }
}

module.exports = Receipt;