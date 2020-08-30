import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlatillosPage } from './platillos.page';

describe('PlatillosPage', () => {
  let component: PlatillosPage;
  let fixture: ComponentFixture<PlatillosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatillosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlatillosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
