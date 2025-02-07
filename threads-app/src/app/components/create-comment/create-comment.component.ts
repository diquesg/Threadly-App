import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-create-comment',
  imports: [],
  templateUrl: './create-comment.component.html',
  styleUrl: './create-comment.component.scss'
})
export class CreateCommentComponent {
  @Input() placeholder = 'Type your reply...'
  @Input() buttonText = 'Send'
  @Output() formSubmitted = new EventEmitter<{
    text: string;
  }>();

  formSubmit(event: SubmitEvent) {
    event?.preventDefault();
    const form = event.target as HTMLFormElement;
    const textAreaElement = form.elements.namedItem('commentText') as HTMLTextAreaElement;
    const commentText = textAreaElement.value;
    form.reset();
    console.log({ commentText })
    this.formSubmitted.emit({
      text: commentText,
    });
  }
}
