import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase.client';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router, private logService: LogService) {}

  async canActivate(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      this.logService.warn('Tentativa de acesso à rota protegida sem sessão. Redirecionando para login.');
      this.router.navigate(['/auth']);
      return false;
    }
    
    return true;
  }
}
