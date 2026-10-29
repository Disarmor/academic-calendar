import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { MaterialItem } from '../../../core/materials/materials-utils';
import { MATERIAL_KIND_LABELS } from '../../../shared/labels';

@Component({
  imports: [NgTemplateOutlet],
  selector: 'app-material-list',
  styleUrl: './material-list.scss',
  templateUrl: './material-list.html',
})
export class MaterialList {
  readonly items = input.required<readonly MaterialItem[]>();

  protected readonly kindLabels = MATERIAL_KIND_LABELS;
}
