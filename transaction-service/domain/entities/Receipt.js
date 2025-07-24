class ReceiptEvent {
    constructor(userId) {
        this.userId = userId;
        this.items = [];
        this.timestamp = new Date();
        this.totalPrice = 0;
    }

    applyEvents(events) {
        for (const event of events) {
            this.apply(event);
        }
    }

    apply(event) {
        
    }
}