import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReviewComponent } from './order-review.component';

describe('OrderReviewComponent', () => {
  let component: OrderReviewComponent;
  let fixture: ComponentFixture<OrderReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
