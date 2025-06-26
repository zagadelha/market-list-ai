import { Component } from '@angular/core';
import { IonicModule, AlertController, MenuController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { supabase } from '../supabase.client';
import { Router } from '@angular/router';

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

  constructor(
    private alertController: AlertController,
    private router: Router,
    private menuCtrl: MenuController
  ) {}

  async ngOnInit() {
    await this.menuCtrl.enable(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      this.router.navigate(['/auth']);
      return;
    }
    await this.loadTasks();
  }

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
    const now = new Date().toISOString();
    try {
      const { data, error } = await supabase.from('items').insert([
        { title, done: false, initial_date: [now] }
      ]).select();
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
    const updatedDone = task.done;
    this.tasks[index].done = updatedDone;
    const moved = this.tasks.splice(index, 1)[0];
    if (updatedDone) {
      this.tasks.push(moved);
      // Adiciona data corrente ao final_date ao finalizar
      const now = new Date().toISOString();
      // Busca o array atual de final_date
      const { data, error } = await supabase.from('items').select('final_date').eq('id', task.id).single();
      let finalDate: string[] = Array.isArray(data?.final_date) ? data.final_date : [];
      finalDate.push(now);
      await supabase.from('items')
        .update({
          done: updatedDone,
          final_date: finalDate
        })
        .eq('id', task.id);
      return;
    } else {
      this.tasks.unshift(moved);
      // Adiciona data corrente ao initial_date ao desselecionar
      const now = new Date().toISOString();
      const { data, error } = await supabase.from('items').select('initial_date').eq('id', task.id).single();
      let initialDate: string[] = Array.isArray(data?.initial_date) ? data.initial_date : [];
      initialDate.push(now);
      await supabase.from('items')
        .update({
          done: updatedDone,
          initial_date: initialDate
        })
        .eq('id', task.id);
      return;
    }
    // Atualiza apenas o status se não for desselecionar
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
