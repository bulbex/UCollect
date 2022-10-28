import { APP_INITIALIZER, NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "./routing/app-routing.module"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule, HttpClient } from "@angular/common/http"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { TranslateModule, TranslateLoader, TranslatePipe } from "@ngx-translate/core"
import { MarkdownModule } from "ngx-markdown"
import { NgxFileDropModule } from 'ngx-file-drop'

import { AppComponent } from "./app.component"
import { HeaderComponent } from "./_components/header/header.component"
import { MainComponent } from "./_components/main/main.component"
import { SignupComponent } from "./_components/authentication/signup/signup.component"
import { SigninComponent } from "./_components/authentication/signin/signin.component"
import { CollectionComponent } from "./_components/user/collection-components/collection/collection.component"
import { CreateCollectionComponent } from "./_components/user/collection-components/create-collection/create-collection.component";
import { UserCollectionsComponent } from './_components/user/collection-components/user-collections/user-collections.component'
import { AddItemComponent } from './_components/user/item-components/add-item/add-item.component';
import { EditItemComponent } from './_components/user/item-components/edit-item/edit-item.component';
import { EditCollectionComponent } from './_components/user/collection-components/edit-collection/edit-collection.component';

import { PasswordConfirmDirective } from "./custom-validators/password-validator/pass-confirm.directive"
import { TagsDirective } from "./custom-validators/tags-validator/tags.directive"
import { NoSpacesDirective } from "./custom-validators/no-spaces-validator/no-spaces.directive"
import { HttpInterceptorsProvider } from "./http-interceptors"
import { TranslateHttpLoaderFactory } from "./translate-http-loader/translate-http-loader"
import { initializeAppFactory } from "./app-initializer/initialize-app"
import { ItemComponent } from "./_components/user/item-components/item/item.component";
import { PageNotFoundComponent } from './_components/page-not-found/page-not-found.component'
import { TagCloudModule } from "angular-tag-cloud-module"
import { UserService } from "./_services/user/user.service"
import { SearchResultComponent } from './_components/search-result/search-result.component';
import { AdminPanelComponent } from './_components/admin/admin-panel/admin-panel.component'

@NgModule({
    declarations: [
        AppComponent,
        SignupComponent,
        HeaderComponent,
        MainComponent,
        SigninComponent,
        PasswordConfirmDirective,
        NoSpacesDirective,
        TagsDirective,
        UserCollectionsComponent,
        CollectionComponent,
        CreateCollectionComponent,
        AddItemComponent,
        EditItemComponent,
        EditCollectionComponent,
        ItemComponent,
        PageNotFoundComponent,
        SearchResultComponent,
        AdminPanelComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: TranslateHttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        MarkdownModule.forRoot({
            loader: HttpClient
        }),
        NgxFileDropModule,
        TagCloudModule
    ],
    providers: [
        HttpInterceptorsProvider,
        TranslatePipe,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeAppFactory,
            deps: [UserService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
