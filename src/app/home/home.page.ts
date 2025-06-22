import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
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
    { title: 'Estudar Angular', done: false },
    { title: 'Criar layout no Ionic', done: false },
    { title: 'Testar app no celular', done: false }
  ];

  constructor() {}

  addTask() {
    const title = this.newTask.trim();
    if (title) {
      this.tasks.unshift({ title, done: false });
      this.newTask = '';
    }
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
  }
}
