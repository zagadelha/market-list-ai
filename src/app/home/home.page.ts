import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Task {
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class HomePage {
  newTask: string = '';
  tasks: Task[] = [
    { title: 'Arroz', done: false },
    { title: 'Feijão', done: false },
    { title: 'Óleo de Soja', done: false },
    { title: 'Açúcar', done: false },
    { title: 'Café', done: false },
    { title: 'Leite', done: false },
    { title: 'Pão', done: false },
    { title: 'Ovos', done: false },
    { title: 'Macarrão', done: false },
    { title: 'Carnes', done: false }
  ];

  constructor(private alertController: AlertController) {}

  addTask() {
    const title = this.newTask.trim();
    if (title) {
      this.tasks.unshift({ title, done: false });
      this.newTask = '';
    }
  }

  async removeTask(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza que deseja excluir esta tarefa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.tasks.splice(index, 1);
          },
        },
      ],
    });
    await alert.present();
  }

  reorderTasks(event: CustomEvent) {
    const from = event.detail.from;
    const to = event.detail.to;
    if (from !== to) {
      const moved = this.tasks.splice(from, 1)[0];
      this.tasks.splice(to, 0, moved);
    }
    event.detail.complete();
  }

  get totalTasks(): number {
    return this.tasks.length;
  }

  get toBuyCount(): number {
    return this.tasks.filter(t => !t.done).length;
  }

  get boughtCount(): number {
    return this.tasks.filter(t => t.done).length;
  }
}
