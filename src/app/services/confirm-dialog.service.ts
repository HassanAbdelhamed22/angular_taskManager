import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface DialogState extends ConfirmDialogOptions {
  isOpen: boolean;
  resolve?: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  state = signal<DialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });

  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.state.set({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        resolve
      });
    });
  }

  onConfirm() {
    const resolve = this.state().resolve;
    this.close();
    if (resolve) resolve(true);
  }

  onCancel() {
    const resolve = this.state().resolve;
    this.close();
    if (resolve) resolve(false);
  }

  private close() {
    this.state.update(s => ({ ...s, isOpen: false, resolve: undefined }));
  }
}
