import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor() {}

  error(message: string, error?: any) {
    console.error(`[Error] ${message}`, error);
    // Aqui você pode adicionar integração com serviços de monitoramento como Sentry, LogRocket, etc
  }

  warn(message: string, data?: any) {
    console.warn(`[Warning] ${message}`, data);
  }

  info(message: string, data?: any) {
    console.info(`[Info] ${message}`, data);
  }
}
