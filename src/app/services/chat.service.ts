import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '../../../models/chat-message';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    // <>
    private stompClient: any;
    private messageSubject: BehaviorSubject<ChatMessage[]> =
        new BehaviorSubject<ChatMessage[]>([]);
    constructor() {
        this.initConnectionSocket();
    }

    initConnectionSocket() {
        const url = 'http://54.173.19.90:4002/chat-socket';
        const socket = new SockJS(url);
        return (this.stompClient = Stomp.over(socket));
    }

    joinRoom(roomId: string) {
        this.stompClient.connect({}, () => {
            this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
                const messageContent = JSON.parse(messages.body);
                console.log(messageContent);
                const currentsMessage = this.messageSubject.getValue();
                currentsMessage.push(messageContent);

                this.messageSubject.next(currentsMessage);
            });
        });
    }

    sendMessage(roomId: string, chatMessage: any) {
        this.stompClient.send(
            `/app/chat/${roomId}`,
            {},
            JSON.stringify(chatMessage)
        );
    }

    getMessageSubject() {
        return this.messageSubject.asObservable();
    }
}
