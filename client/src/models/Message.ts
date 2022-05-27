export class Message {
    messageText!: string;
    isReceived!: boolean;

    constructor(messageText: string, isReceived: boolean) {
        this.messageText = messageText;
        this.isReceived = isReceived;
    }
}