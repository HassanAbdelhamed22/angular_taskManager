import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../types';

@Component({
  selector: 'app-add-task',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTaskComponent {
  taskData: Task = {
    id: '',
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    category: 'Work',
    tags: '',
    isDone: false,
  };

  private STORAGE_KEY = 'task_manager_tasks';

  constructor(private router: Router) {}

  handleSubmit() {
    if (!this.taskData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const newTask: Task = {
      ...this.taskData,
      id: uuidv4(),
    };

    const savedTasks = localStorage.getItem(this.STORAGE_KEY);
    let tasks: Task[] = [];
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
    }
    tasks.push(newTask);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));

    this.router.navigate(['/tasks']);
  }
}
