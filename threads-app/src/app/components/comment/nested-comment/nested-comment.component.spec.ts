import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedCommentComponent } from './nested-comment.component';

describe('NestedCommentComponent', () => {
  let component: NestedCommentComponent;
  let fixture: ComponentFixture<NestedCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestedCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
