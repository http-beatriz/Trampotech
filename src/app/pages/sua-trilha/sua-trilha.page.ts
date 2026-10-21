import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  checkmarkOutline, 
  compassOutline, 
  ellipseOutline, 
  checkmarkCircle,
  informationCircleOutline,
  arrowBackOutline,
  arrowForwardOutline
} from 'ionicons/icons';
import { AuthService, Usuario } from '../../services/auth';
import { IonHeader, IonToolbar, IonTitle } from "@ionic/angular";

@Component({
  selector: 'app-sua-trilha',
  templateUrl: './sua-trilha.page.html',
  styleUrls: ['./sua-trilha.page.scss'],
  standalone: true,
  imports: [IonTitle, IonToolbar, IonHeader, CommonModule, IonContent, IonIcon]
})
export class SuaTrilhaPage implements OnInit {
// ... o restante do arquivo continua igual!
  usuarioLogado: Usuario | null = null;
  trilhaSelecionada: 'execucao' | 'fundamentos' | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      searchOutline,
      checkmarkOutline,
      compassOutline,
      ellipseOutline,
      checkmarkCircle,
      informationCircleOutline,
      arrowBackOutline,
      arrowForwardOutline
    });
  }

  ngOnInit() {
    this.usuarioLogado = this.authService.getUsuarioLogado();
    if (this.usuarioLogado?.trilhaEscolhida) {
      this.trilhaSelecionada = this.usuarioLogado.trilhaEscolhida;
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.usuarioLogado = this.authService.getUsuarioLogado();
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  // Gera as iniciais (ex: "Marina Costa" -> "MC")
  get iniciaisUsuario(): string {
    const nome = this.usuarioLogado?.nome || 'Marina Costa';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  selecionarTrilha(trilha: 'execucao' | 'fundamentos') {
    this.trilhaSelecionada = trilha;
  }

  voltar() {
    this.router.navigate(['/cadastro']);
  }

  async continuar() {
    if (!this.trilhaSelecionada) return;

    // Faz o UPDATE no localStorage caso exista um usuário logado
    if (this.usuarioLogado) {
      const usuarioAtualizado: Usuario = {
        ...this.usuarioLogado,
        trilhaEscolhida: this.trilhaSelecionada
      };
      this.authService.atualizarUsuario(usuarioAtualizado);
    }

    const toast = await this.toastCtrl.create({
      message: `Trilha "${this.trilhaSelecionada === 'execucao' ? 'Da ideia à execução' : 'Comece pelos fundamentos'}" salva no localStorage!`,
      duration: 2500,
      color: 'success',
      position: 'top'
    });
    await toast.present();

    // Redireciona para a página seguinte (ex: Home/Sidemenu ou Diagnóstico)
    this.router.navigate(['/folder/inbox']);
  }
}