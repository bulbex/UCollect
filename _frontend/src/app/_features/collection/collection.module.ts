import { NgModule } from '@angular/core';
import { CollectionViewComponent } from './collection-view/collection-view.component';
import { CreateCollectionComponent } from './create-collection/create-collection.component';
import { EditCollectionComponent } from './edit-collection/edit-collection.component';
import { UserCollectionsViewComponent } from './user-collections-view/user-collections-view.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ItemsModule } from '../collection-items/items.module';
import { NoSpacesDirective } from 'src/app/custom-validators/no-spaces-validator/no-spaces.directive';

const collectionRoutes: Routes = [
    { path: "collections/:name", component: CollectionViewComponent },
    { path: "user/:username", component: UserCollectionsViewComponent },
    { path: "user/:username/new-collection", component: CreateCollectionComponent },
]

@NgModule({
  declarations: [CollectionViewComponent, CreateCollectionComponent, EditCollectionComponent, UserCollectionsViewComponent],
  imports: [
    SharedModule,
    NgxFileDropModule,
    ItemsModule,
    RouterModule.forChild(collectionRoutes),
    MarkdownModule.forRoot({
        loader: HttpClient
    }),
    NoSpacesDirective
  ]
})
export class CollectionModule { }
