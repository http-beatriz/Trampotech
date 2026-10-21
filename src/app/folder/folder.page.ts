import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  MenuController,
  ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  gitNetworkOutline,
  chatbubblesOutline,
  informationCircleOutline,
  personOutline,
  playCircleOutline,
  lockClosedOutline,
  checkmarkOutline,
  timeOutline,
  createOutline,
  trashOutline,
  personAddOutline,
  closeOutline,
  arrowUpOutline,
  compassOutline
} from 'ionicons/icons';
import { AuthService, Usuario } from '../services/auth';

export interface MensagemTutor {
  autor: 'ia' | 'usuario';
  titulo?: string;
  texto: string;
}

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon
  ],
})
export class FolderPage implements OnInit {
  abaAtiva: 'visao-geral' | 'tutor' | 'avaliacoes' | 'perfil' = 'visao-geral';

  usuarioLogado: Usuario | null = null;
  usuarios: Usuario[] = [];

  // Estado do Tutor IA
  conceitoSelecionado: string = 'Criar uma hipótese';
  textoMensagem: string = '';
  mensagensTutor: MensagemTutor[] = [];
  private readonly CHAT_STORAGE_KEY = 'trilha_mensagens_tutor';

  // Estado para o CRUD na aba "Editar perfil"
  editandoId: string | null = null;
  formEdicao: { nome: string; email: string; trilhaEscolhida: 'execucao' | 'fundamentos' } = {
    nome: '',
    email: '',
    trilhaEscolhida: 'execucao'
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      searchOutline,
      gitNetworkOutline,
      chatbubblesOutline,
      informationCircleOutline,
      personOutline,
      playCircleOutline,
      lockClosedOutline,
      checkmarkOutline,
      timeOutline,
      createOutline,
      trashOutline,
      personAddOutline,
      closeOutline,
      arrowUpOutline,
      compassOutline
    });
  }

  ngOnInit() {
    this.carregarDados();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.carregarDados();
  }

  carregarDados() {
    this.usuarioLogado = this.authService.getUsuarioLogado();
    this.usuarios = this.authService.listarUsuarios();

    const chatSalvo = localStorage.getItem(this.CHAT_STORAGE_KEY);
    if (chatSalvo) {
      this.mensagensTutor = JSON.parse(chatSalvo);
    } else {
      this.mensagensTutor = [
        {
          autor: 'ia',
          titulo: 'Contexto do módulo • Contexto inicial',
          texto: 'Qual é a dor real do seu negócio agora? Conte o tipo de negócio, o estágio e o que está travando. Isso ajuda a personalizar o contexto sem alterar o progresso do módulo.'
        }
      ];
    }
  }

  get iniciaisUsuario(): string {
    const nome = this.usuarioLogado?.nome || 'Marina Costa';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  get nomeTrilhaAtiva(): string {
    return this.usuarioLogado?.trilhaEscolhida === 'fundamentos'
      ? 'Comece pelos fundamentos'
      : 'Da ideia à execução';
  }

  selecionarAba(aba: 'visao-geral' | 'tutor' | 'avaliacoes' | 'perfil') {
    this.abaAtiva = aba;
  }

  // Na Visão Geral, clicar em "Iniciar estudo" leva para o Tutor IA!
  iniciarEstudo() {
    this.abaAtiva = 'tutor';
  }

  // --- Funções do Tutor IA ---
  selecionarConceito(conceito: string) {
    this.conceitoSelecionado = conceito;
    if (!this.textoMensagem.trim()) {
      this.textoMensagem = `Quero aplicar "${conceito}" no meu negócio atual...`;
    }
  }

  async enviarMensagemTutor() {
    const texto = this.textoMensagem.trim();
    if (!texto) return;

    this.mensagensTutor.push({
      autor: 'usuario',
      titulo: 'Seu contexto enviado',
      texto
    });

    this.textoMensagem = '';

    // Resposta contextualizada simulada para o "Caminho Feliz"
    this.mensagensTutor.push({
      autor: 'ia',
      titulo: `Tutor IA • Foco em ${this.conceitoSelecionado}`,
      texto: `Excelente ponto! Para validar essa dor no módulo de Estratégia e discovery, defina uma hipótese clara e um experimento rápido de MVP antes de construir funcionalidades complexas.`
    });

    localStorage.setItem(this.CHAT_STORAGE_KEY, JSON.stringify(this.mensagensTutor));
    await this.mostrarToast('Contexto guardado no localStorage!', 'success');
  }

  // --- Funções do CRUD (em "Editar perfil") ---
  iniciarEdicao(user: Usuario) {
    this.editandoId = user.id;
    this.formEdicao = {
      nome: user.nome,
      email: user.email,
      trilhaEscolhida: user.trilhaEscolhida || 'execucao'
    };
  }

  cancelarEdicao() {
    this.editandoId = null;
  }

  async salvarEdicao(userOriginal: Usuario) {
    if (!this.formEdicao.nome.trim() || !this.formEdicao.email.trim()) {
      await this.mostrarToast('Preencha o nome e o e-mail.', 'warning');
      return;
    }

    const atualizado: Usuario = {
      ...userOriginal,
      nome: this.formEdicao.nome,
      email: this.formEdicao.email,
      trilhaEscolhida: this.formEdicao.trilhaEscolhida
    };

    this.authService.atualizarUsuario(atualizado);
    this.editandoId = null;
    this.carregarDados();
    await this.mostrarToast('Perfil atualizado com sucesso no localStorage!', 'success');
  }

  async excluirUsuario(id: string) {
    this.authService.removerUsuario(id);
    if (this.usuarioLogado?.id === id) {
      this.authService.logout();
    }
    this.carregarDados();
    await this.mostrarToast('Utilizador removido do localStorage!', 'danger');
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }

  private async mostrarToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'top'
    });
    await toast.present();
  }
}