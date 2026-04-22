import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-input',
  templateUrl: './task-input.component.html',
  styleUrl: './task-input.component.css',
  imports: [FormsModule],
})
export class TaskInputComponent implements OnInit {
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() closeModal = new EventEmitter<void>();

  @Input() taskFormData: Task | null = null;

  @Output() validationError = new EventEmitter<string>();

  localTaskData: Task = {
    id: '',
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
    category: 'Personal',
    tags: '',
    isDone: false,
  };

  ngOnInit() {
    if (this.taskFormData) {
      this.localTaskData = { ...this.taskFormData };
    }
  }

  closeModalFn() {
    this.closeModal.emit();
  }

  addTask() {
    if (this.localTaskData.title === '' || this.localTaskData.title.trim() === '') {
      this.validationError.emit('Title is required');
      return;
    }

    if (this.localTaskData.id === '') {
      this.localTaskData.id = uuidv4();
    }

    this.taskCreated.emit(this.localTaskData);

    this.closeModalFn();
  }
}
