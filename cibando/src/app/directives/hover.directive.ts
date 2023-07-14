import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {
  @HostBinding('style.background-color') background: string;
  @HostBinding('style.color') iconColor: string;

  @HostListener('mouseover') changeCombo() {
    this.background = '$primary-color-1';
    this.iconColor = '$primary-color-2';
  }
  @HostListener('mouseout') returnToOrigin() {
    this.background = '$primary-color-2';
    this.iconColor = '$primary-color-1';
  }

  constructor() { }

}
