import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, MenuController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { LogService } from './services/log.service';
import { supabase } from './supabase.client';
import { 
  logInOutline, 
  personAddOutline, 
  logoGoogle, 
  addOutline,
  trashOutline,
  menuOutline,
  ellipsisVerticalOutline,
  logOutOutline,
  personOutline,
  settingsOutline,
  listOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-menu contentId="main-content" type="overlay">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Menu</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list lines="full">
            <ion-menu-toggle auto-hide="true">
              <ion-item button detail lines="none" (click)="goTo('/home')">
                <ion-icon name="list-outline" slot="start"></ion-icon>
                <ion-label>Lista</ion-label>
              </ion-item>
              <ion-item button detail lines="none" (click)="goTo('/conta')">
                <ion-icon name="person-outline" slot="start"></ion-icon>
                <ion-label>Conta</ion-label>
              </ion-item>
              <ion-item button detail lines="none" (click)="goTo('/configuracoes')">
                <ion-icon name="settings-outline" slot="start"></ion-icon>
                <ion-label>Configurações</ion-label>
              </ion-item>
              <ion-item button detail lines="none" (click)="logout()">
                <ion-icon name="log-out-outline" slot="start"></ion-icon>
                <ion-label>Sair</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <div class="ion-page" id="main-content">
        <ion-router-outlet></ion-router-outlet>
      </div>
    </ion-app>
  `,
  standalone: true,
  // These imports are used in the template, TypeScript may incorrectly mark them as unused
  providers: [LogService],
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle
  ]
})
export class AppComponent {
  constructor(
    private router: Router,
    private logService: LogService,
    private menuCtrl: MenuController
  ) {
    // Register Ionic icons
    addIcons({
      'log-in-outline': logInOutline,
      'person-add-outline': personAddOutline,
      'logo-google': logoGoogle,
      'add-outline': addOutline,
      'trash-outline': trashOutline,
      'menu-outline': menuOutline,
      'ellipsis-vertical-outline': ellipsisVerticalOutline,
      'log-out-outline': logOutOutline,
      'person-outline': personOutline,
      'settings-outline': settingsOutline,
      'list-outline': listOutline
    });
  }

  async goTo(path: string) {
    await this.menuCtrl.close();
    this.router.navigate([path]);
  }

  async logout() {
    try {
      await this.menuCtrl.close();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      this.logService.info('Usuário deslogou com sucesso');
      this.router.navigate(['/auth']);
    } catch (error: any) {
      this.logService.error('Erro ao fazer logout:', error);
    }
  }
}
