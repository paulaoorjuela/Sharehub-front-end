import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, input } from '@angular/core';
import { SharehubApiService } from '../../services/sharehub-api.service';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
})
export class ChatComponent {
    messageInput = new FormControl('');
    userId: string = '';
    messageList: any[] = [];
    private Services = inject(SharehubApiService);
    idUsuarioPayload!: string;

    constructor(
        private chatService: ChatService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.userId = this.route.snapshot.params['userId'];
        this.chatService.joinRoom('ShareHub');
        this.lisenerMesage();
        if (sessionStorage.getItem('token') == null) {
            this.router.navigate(['/']);
        }
        // -------------------imagen de chat--------------------
        let tokenSession = sessionStorage.getItem('token');
        this.Services.postDesencriptarPayload(tokenSession).subscribe(
            (respuestaApi: any) => {
                console.log(respuestaApi.id);
                this.idUsuarioPayload = respuestaApi.id;
                this.Services.getUsuario(respuestaApi.id).subscribe({
                    next: (respuestaApi: any) => {
                        console.log('-----------------');

                        console.log(respuestaApi);
                        console.log('-----------------');

                        sessionStorage.setItem("nombre", respuestaApi.nombre);
                        sessionStorage.setItem("imagen", respuestaApi.imguser);

                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
            }
        );
    }

    sendMessage() {
        let mensaje = this.messageInput.value
        let ChatMessage = {
            message: mensaje,
            user: this.userId,
            nombre: sessionStorage.getItem("nombre"),
            imguser: sessionStorage.getItem("imagen")
        };
        this.chatService.sendMessage('ShareHub', ChatMessage);
        console.log(this.messageInput.value);
        const input = document.getElementById('inputText') as HTMLInputElement;
        input.value = '';
        mensaje = ''
    }

    lisenerMesage() {
        this.chatService.getMessageSubject().subscribe((messages: any) => {
            this.messageList = messages.map((item: any) => ({
                ...item,
                message_side: item.user === this.userId ? 'sender' : 'receiver',
            }));
        });
    }
}
