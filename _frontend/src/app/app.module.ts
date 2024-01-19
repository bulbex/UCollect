import { APP_INITIALIZER, NgModule } from "@angular/core"
import { HttpClientModule, HttpClient } from "@angular/common/http"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { TranslateModule, TranslateLoader, TranslatePipe } from "@ngx-translate/core"

import { AppComponent } from "./app.component"
import { HeaderComponent } from "./standalone-components/header/header.component"
import { MainPageComponent } from "./standalone-components/main-page/main-page.component"

import { HttpInterceptorsProvider } from "./http-interceptors"
import { TranslateHttpLoaderFactory } from "./translate-http-loader/translate-http-loader"
import { initializeAppFactory } from "./app-initializer/initialize-app"
import { PageNotFoundComponent } from './standalone-components/page-not-found/page-not-found.component'
import { UserService } from "./_services/user/user.service"
import { RouterModule, Routes } from "@angular/router"
import { BrowserModule } from "@angular/platform-browser"
import { CollectionModule } from "./_features/collection/collection.module"
import { ItemsModule } from "./_features/collection-items/items.module"

const routes: Routes = [
    { path: "", component: MainPageComponent },
    { path: "authentication", loadChildren: () => import("./authentication/authentication.module").then(_ => _.AuthenticationModule) },
    { path: "search/:searchValue", loadComponent: () => import("./standalone-components/search-result/search-result.component").then(_ => _.SearchResultComponent) },
    { path: "admin-panel", loadComponent: () => import("./standalone-components/admin-panel/admin-panel.component").then(_ => _.AdminPanelComponent) },
    // Page not found
    { path: "**", pathMatch: "full", component: PageNotFoundComponent },
]

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HeaderComponent,
        HttpClientModule,
        BrowserAnimationsModule,
        MainPageComponent,
        CollectionModule,
        ItemsModule,
        RouterModule.forRoot(routes),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: TranslateHttpLoaderFactory,
                deps: [HttpClient],
            },
        })
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
