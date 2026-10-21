import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonIcon, 
  IonCheckbox, 
  MenuController, 
  ToastController 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, checkmarkOutline, arrowForwardOutline, compassOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    IonContent, 
    IonIcon, 
    IonCheckbox
  ]
})
export class CadastroPage implements OnInit {
// ... o restante do arquivo continua igual!
  form!: FormGroup;
  modoLogin = false; // Permite alternar entre "Criar conta" e "Entrar"

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController
  ) {
    addIcons({ checkmarkCircleOutline, checkmarkOutline, arrowForwardOutline, compassOutline });
  }

  ngOnInit() {
    // Inicializa já com os dados de exemplo da Marina ou vazio (deixei preenchido para facilitar sua demo amanhã!)
    this.form = this.fb.group({
      nome: ['Marina Costa', [Validators.required, Validators.minLength(3)]],
      email: ['marina@startup.com', [Validators.required, Validators.email]],
      senha: ['12345678a', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)]],
      termos: [true, [Validators.requiredTrue]]
    });
  }

  // Esconde o Sidemenu ao entrar na tela de Login/Cadastro
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  // Reativa o Sidemenu ao sair para a tela principal do projeto
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  get primeiroNome(): string {
    const nome = this.form.get('nome')?.value || '';
    return nome.split(' ')[0] || 'visitante';
  }

  alternarModo() {
    this.modoLogin = !this.modoLogin;
  }

  async submeter() {
    if (this.modoLogin) {
      const { email, senha } = this.form.value;
      const sucesso = this.authService.login(email, senha);
      if (sucesso) {
        await this.mostrarToast('Login realizado com sucesso!', 'success');
        this.router.navigate(['/folder/inbox']); // Mude para a rota da sua Home/CRUD
      } else {
        await this.mostrarToast('E-mail ou senha não encontrados no localStorage.', 'danger');
      }
      return;
    }

    if (this.form.valid) {
      const { nome, email, senha, termos } = this.form.value;
      this.authService.registrar({
        nome,
        email,
        senha,
        termosAceitos: termos
      });

      await this.mostrarToast('Conta salva no localStorage com sucesso!', 'success');
      
      // Redireciona para a rota padrão do Sidemenu (ajuste se sua rota for outra)
      this.router.navigate(['/sua-trilha']);
    } else {
      this.form.markAllAsTouched();
      await this.mostrarToast('Preencha todos os campos corretamente.', 'warning');
    }
  }

  private async mostrarToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });
    await toast.present();
  }
}