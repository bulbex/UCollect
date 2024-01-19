import { NgModule } from '@angular/core';
import { EditItemComponent } from './edit-item/edit-item.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ItemViewComponent } from './item-view/item-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { NoSpacesDirective } from 'src/app/custom-validators/no-spaces-validator/no-spaces.directive';
import { TagsDirective } from 'src/app/custom-validators/tags-validator/tags.directive';

const itemsRoutes: Routes = [
    { path: "items/:itemId", component: ItemViewComponent }
]

@NgModule({
  declarations: [EditItemComponent, AddItemComponent, ItemViewComponent],
  exports: [EditItemComponent, AddItemComponent, ItemViewComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(itemsRoutes),
    NoSpacesDirective,
    TagsDirective
  ]
})
export class ItemsModule { }
