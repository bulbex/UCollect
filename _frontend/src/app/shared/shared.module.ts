import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { NoSpacesDirective } from '../custom-validators/no-spaces-validator/no-spaces.directive';
import { TagsDirective } from '../custom-validators/tags-validator/tags.directive';



@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  imports: [],
})
export class SharedModule { }
