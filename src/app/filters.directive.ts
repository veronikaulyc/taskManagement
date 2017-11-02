import {Directive, HostListener, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[menuElement]',
})

export class FiltersDirective {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ){}

handleEnter(target){
  this.renderer.addClass(target, 'trigger-enter');
  setTimeout(() => target.classList.contains('trigger-enter') &&
    this.renderer.addClass(target, 'trigger-enter-active'), 150);
    this.el.nativeElement.querySelector('.dropdownBackground').classList.add('open');

  const dropdown = target.querySelector('.dropdown');
  const dropdownCords = dropdown.getBoundingClientRect();
  const filterNavCoords = this.el.nativeElement.getBoundingClientRect();
  const coords = {
    height: dropdownCords.height,
    width: dropdownCords.width,
    top: dropdownCords.top - filterNavCoords.top-40,
    left: dropdownCords.left- filterNavCoords.left
  };
  this.el.nativeElement.querySelector('.dropdownBackground').style.setProperty('width', `${coords.width}px`);
  this.el.nativeElement.querySelector('.dropdownBackground').style.setProperty('height', `${coords.height}px`);
  this.el.nativeElement.querySelector('.dropdownBackground').style.setProperty('transform', `translate(${coords.left}px, ${coords.top}px)`);

}

handleLeave(target){
  this.renderer.removeClass(target, 'trigger-enter');
  this.renderer.removeClass(target, 'trigger-enter-active');
  this.el.nativeElement.querySelector('.dropdownBackground').classList.remove('open');
}

}
