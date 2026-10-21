import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuaTrilhaPage } from './sua-trilha.page';

describe('SuaTrilhaPage', () => {
  let component: SuaTrilhaPage;
  let fixture: ComponentFixture<SuaTrilhaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuaTrilhaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
