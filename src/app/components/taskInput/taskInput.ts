import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Task {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  category: string;
  tags: string;
}

@Component({
  selector: 'app-task-input',
  templateUrl: './taskInput.html',
  styleUrls: ['./taskInput.css'],
  imports: [FormsModule],
})
export class TaskInputComponent {
  title = '';
  description = '';
  priority = 'Medium';
  dueDate = '';
  category = 'Personal';
  tags = '';

  tasks: Task[] = [];

  addTask() {
    const newTask: Task = {
      title: this.title,
      description: this.description,
      priority: this.priority,
      dueDate: this.dueDate,
      category: this.category,
      tags: this.tags,
    };

    this.tasks.push(newTask);
    console.log(this.tasks);

    this.resetForm();
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.priority = 'Medium';
    this.dueDate = '';
    this.category = 'Personal';
    this.tags = '';
  }
}
