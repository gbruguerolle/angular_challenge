import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  strokeWidth = input<string>('3');
  animationDuration = input<string>('0.8s');
}