import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzaPartyAnnotatedComponent } from './pizza-party-annotated.component';

describe('PizzaPartyAnnotatedComponent', () => {
  let component: PizzaPartyAnnotatedComponent;
  let fixture: ComponentFixture<PizzaPartyAnnotatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzaPartyAnnotatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PizzaPartyAnnotatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
