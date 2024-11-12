import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemSkeletonComponent } from './cart-item-skeleton.component';

describe('CartItemSkeletonComponent', () => {
  let component: CartItemSkeletonComponent;
  let fixture: ComponentFixture<CartItemSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItemSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
