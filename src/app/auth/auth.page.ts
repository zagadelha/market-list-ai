import { Component } from '@angular/core';
import { IonicModule, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { supabase } from '../supabase.client';
import { Router } from '@angular/router';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],  standalone: true,  imports: [IonicModule, FormsModule],
  providers: [LogService, AlertController],
})
export class AuthPage {
  email = '';
  password = '';
  loading = false;
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private logService: LogService
  ) {}

  async ngOnInit() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.aud === 'authenticated') {
        await this.router.navigate(['/home'], { replaceUrl: true });
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({ 
      message, 
      duration: 2500, 
      color,
      position: 'top'
    });
    toast.present();
  }
  async signUp() {
    if (!this.email || !this.password) {
      this.presentToast('Preencha todos os campos');
      return;
    }

    if (this.password.length < 6) {
      this.presentToast('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.presentToast('Email inválido');
      return;
    }

    this.loading = true;
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email: this.email.trim(), 
        password: this.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        throw error;
      }

      if (data?.user?.identities?.length === 0) {
        this.presentToast('Este email já está cadastrado', 'warning');
      } else {
        this.presentToast('Cadastro realizado! Verifique seu e-mail.', 'success');
        this.email = '';
        this.password = '';
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      this.presentToast(error.message || 'Erro ao criar conta');
    } finally {
      this.loading = false;
    }
  }

  async signIn() {
    if (!this.email || !this.password) {
      this.presentToast('Preencha todos os campos');
      return;
    }

    this.loading = true;
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email: this.email, 
        password: this.password 
      });
      
      if (error) {
        this.logService.error('Erro ao fazer login:', error);
        this.presentToast(error.message);
      } else if (data.session) {
        await this.router.navigate(['/home'], { replaceUrl: true });
      }
    } catch (error: any) {
      this.logService.error('Erro inesperado ao fazer login:', error);
      this.presentToast('Erro ao fazer login');
    } finally {
      this.loading = false;
    }
  }

  async signInWithGoogle() {
    this.loading = true;
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/home'
      }
    });
    this.loading = false;

    if (error) {
      this.presentToast(error.message);
    }
  }

  async forgotPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Recuperar Senha',
      message: 'Digite seu email para receber o link de recuperação',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',          handler: async (data) => {
            if (!data.email) {
              this.presentToast('Por favor, digite seu email');
              return false;
            }
            
            const loading = await this.loadingCtrl.create({
              message: 'Enviando email de recuperação...'
            });
            await loading.present();
            
            try {
              const { error } = await supabase.auth.resetPasswordForEmail(data.email);
              if (error) throw error;
              
              this.presentToast('Email de recuperação enviado com sucesso!', 'success');
              return true;
            } catch (error: any) {
              this.logService.error('Erro ao enviar email de recuperação:', error);
              this.presentToast(error.message || 'Erro ao enviar email de recuperação');
              return false;
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async register() {
    if (!this.validateEmail(this.email)) {
      this.presentToast('Por favor, insira um email válido');
      return;
    }

    if (!this.validatePassword(this.password)) {
      this.presentToast('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando...',
    });
    await loading.present();

    try {
      const { error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
      });

      if (error) throw error;

      this.presentToast('Registro realizado com sucesso! Verifique seu email.', 'success');
    } catch (error: any) {
      this.logService.error('Erro no registro:', error);
      if (error.status === 422) {
        this.presentToast('Este email já está cadastrado');
      } else {
        this.presentToast(error.message || 'Erro ao realizar registro');
      }
    } finally {
      loading.dismiss();
    }
  }

  async loginWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
      if (error) throw error;
    } catch (error: any) {
      this.logService.error('Erro no login com Google:', error);
      this.presentToast(error.message || 'Erro ao realizar login com Google');
    }
  }

  async login() {
    if (!this.validateEmail(this.email)) {
      this.presentToast('Por favor, insira um email válido');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Entrando...',
    });
    await loading.present();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });

      if (error) throw error;

      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (error: any) {
      this.logService.error('Erro no login:', error);
      if (error.status === 400) {
        this.presentToast('Email ou senha incorretos');
      } else {
        this.presentToast(error.message || 'Erro ao realizar login');
      }
    } finally {
      loading.dismiss();
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  private validatePassword(password: string): boolean {
    return password.length >= 6;
  }
}
