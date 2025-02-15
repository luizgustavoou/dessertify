import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteStripeComponent } from './teste-stripe.component';

describe('TesteStripeComponent', () => {
  let component: TesteStripeComponent;
  let fixture: ComponentFixture<TesteStripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteStripeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TesteStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
