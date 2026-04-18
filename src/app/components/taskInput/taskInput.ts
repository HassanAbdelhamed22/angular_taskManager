import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input() taskFormData!: Task;

  @Output() validationError = new EventEmitter<string>();

  closeModalFn() {
    this.closeModal.emit();
  }

  addTask() {
    if (this.taskFormData.title === '' || this.taskFormData.title.trim() === '') {
      this.validationError.emit('Title is required');
      return;
    }

    if (this.taskFormData.id === '') {
      this.taskFormData.id = uuidv4();
    }

    this.taskCreated.emit(this.taskFormData);

    this.closeModalFn();
  }
}
