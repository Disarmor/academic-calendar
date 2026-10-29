import { Component, input } from '@angular/core';
import { SubjectMaterialsView } from '../../../core/materials/materials-utils';
import { MaterialList } from '../material-list/material-list';

@Component({
  imports: [MaterialList],
  selector: 'app-subject-materials',
  styleUrl: './subject-materials.scss',
  templateUrl: './subject-materials.html',
})
export class SubjectMaterials {
  readonly view = input.required<SubjectMaterialsView>();
}
