import { Component, input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'progressive-image',
  standalone: true,
  templateUrl: './progressive-image.component.html',
  styleUrl: './progressive-image.component.scss',
  imports: [NgStyle, NgClass],
})
export class ProgressiveImageComponent {
  imageUrl = input.required<string>();
  imageUrlSmall = input.required<string>();
  imageName = input.required<string>();
  isImageLoaded = false;

  onImageLoad() {
    this.isImageLoaded = true;
  }
}
