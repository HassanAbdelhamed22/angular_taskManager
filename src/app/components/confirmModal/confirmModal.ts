import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirmModal.html',
  styleUrls: ['./confirmModal.css'],
})
export class ConfirmModalComponent {
  @Input() title = 'Are you sure?';
  @Input() message = '';
  @Input() confirmText = 'Delete';
  @Input() cancelText = 'Cancel';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
