import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { supabase } from '../supabase.client';

interface Item {
  id: string;
  title: string;
  //created_at?: string;
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
  tasks: Item[] = [];

  constructor(private alertController: AlertController) {}

  /** 
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
  }*/

  reorderTasks(event: CustomEvent) {
    const from = event.detail.from;
    const to = event.detail.to;
    if (from !== to) {
      const moved = this.tasks.splice(from, 1)[0];
      this.tasks.splice(to, 0, moved);
    }
    event.detail.complete();
  }

  /**
  onToggleTask(task: Task, index: number) {
    // Alterna o status
    //if (task.done)     
    //  task.done = !task.done;
    //else
    //  task.done = task.done;

    // Remove da posição atual
    this.tasks.splice(index, 1);
    // Se marcado como feito, vai para o fim; se desmarcado, volta para o início
    if (task.done) {
      this.tasks.push(task);
    } else {
      this.tasks.unshift(task);
    }
  } */

  get totalTasks(): number {
    return this.tasks.length;
  }

  get toBuyCount(): number {
    return this.tasks.filter(t => !t.done).length;
  }

  get boughtCount(): number {
    return this.tasks.filter(t => t.done).length;
  }


  //------------------------

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    try {
      const { data, error } = await supabase.from('items').select('*').order('done').order('title');
      if (error) {
        console.error('Erro ao carregar itens:', error.message);
        this.tasks = [];
      } else {
        this.tasks = data || [];
      }
    } catch (e) {
      console.error('Erro inesperado ao carregar itens:', e);
      this.tasks = [];
    }
  }

  async addTask() {
    const title = this.newTask.trim();
    if (!title) return;
    try {
      const { data, error } = await supabase.from('items').insert([{ title, done: false }]).select();
      if (error) {
        console.error('Erro ao adicionar item:', error.message);
        return;
      }
      if (data && data[0]) {
        this.tasks.unshift(data[0]);
        this.newTask = '';
      }
    } catch (e) {
      console.error('Erro inesperado ao adicionar item:', e);
    }
  }

  async onToggleTask(task: Item, index: number) {
    if (!task.id) return;
    // Alterna o status localmente
    const updatedDone = task.done;
    this.tasks[index].done = updatedDone;
    /**
    const updatedDone = task.done ? false : true;
    if (task.done) 
      this.tasks[index].done = updatedDone;
    else
      this.tasks[index].done = updatedDone;
     */
    // Move para o fim/início conforme status
    const moved = this.tasks.splice(index, 1)[0];
    if (updatedDone) {
      this.tasks.push(moved);
    } else {
      this.tasks.unshift(moved);
    }
    // Salva no Supabase de forma assíncrona (não bloqueia a UI)
    supabase.from('items')
      .update({ done: updatedDone })
      .eq('id', task.id)
      .then(({ error }) => {
        if (error) {
          console.error('Erro ao atualizar item:', error.message);
        }
      });
  }

  async removeTask(index: number) {
    const task = this.tasks[index];
    if (!task.id) return;
    const { error } = await supabase.from('items').delete().eq('id', task.id);
    if (!error) {
      this.tasks.splice(index, 1);
    }
  }

  //-------------------------
  
}
