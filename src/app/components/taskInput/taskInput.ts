import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../types';

@Component({
  selector: 'app-task-input',
  templateUrl: './taskInput.html',
  styleUrls: ['./taskInput.css'],
  imports: [FormsModule],
})
export class TaskInputComponent {
  @Output() taskCreated = new EventEmitter<Task>();

  @Output() closeModal = new EventEmitter<void>();

  title = '';
  description = '';
  priority = 'Medium';
  dueDate = '';
  category = 'Personal';
  tags = '';

  tasks: Task[] = [];

  closeModalFn() {
    this.closeModal.emit();
  }

  addTask() {
    const newTask: Task = {
      id: uuidv4(),
      title: this.title,
      description: this.description,
      priority: this.priority,
      dueDate: this.dueDate,
      category: this.category,
      tags: this.tags,
      isDone: false,
    };

    this.taskCreated.emit(newTask);

    this.resetForm();

    this.closeModalFn();
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
