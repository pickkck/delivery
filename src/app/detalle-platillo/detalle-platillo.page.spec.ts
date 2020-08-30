import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetallePlatilloPage } from './detalle-platillo.page';

describe('DetallePlatilloPage', () => {
  let component: DetallePlatilloPage;
  let fixture: ComponentFixture<DetallePlatilloPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallePlatilloPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetallePlatilloPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
