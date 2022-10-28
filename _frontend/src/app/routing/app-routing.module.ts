import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { MainComponent } from "../_components/main/main.component"
import { SigninComponent } from "../_components/authentication/signin/signin.component"
import { SignupComponent } from "../_components/authentication/signup/signup.component"
import { CreateCollectionComponent } from "../_components/user/collection-components/create-collection/create-collection.component"
import { UserCollectionsComponent } from "../_components/user/collection-components/user-collections/user-collections.component"
import { CollectionComponent } from "../_components/user/collection-components/collection/collection.component"
import { ItemComponent } from "../_components/user/item-components/item/item.component"
import { PageNotFoundComponent } from "../_components/page-not-found/page-not-found.component"
import { SearchResultComponent } from "../_components/search-result/search-result.component"
import { AdminPanelComponent } from "../_components/admin/admin-panel/admin-panel.component"

const routes: Routes = [
    { path: "", component: MainComponent },
    { path: "signin", component: SigninComponent },
    { path: "signup", component: SignupComponent },
    { path: "search/:searchValue", component: SearchResultComponent },
    { path: "user/:username", component: UserCollectionsComponent },
    { path: "user/:username/new-collection", component: CreateCollectionComponent },
    { path: "collections/:name", component: CollectionComponent },
    { path: "items/:itemId", component: ItemComponent },
    { path: "admin-panel", component: AdminPanelComponent },
    // Page not found
    { path: "**", pathMatch: "full", component: PageNotFoundComponent },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
