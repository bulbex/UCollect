import { CommonModule } from "@angular/common"
import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, ParamMap, RouterModule } from "@angular/router"
import { TranslateModule } from "@ngx-translate/core"
import { first, Subscription } from "rxjs"
import { SearchService } from "src/app/_services/search/search.service"

@Component({
    selector: "app-search-result",
    templateUrl: "./search-result.component.html",
    imports: [CommonModule, TranslateModule, RouterModule],
    standalone: true
})
export class SearchResultComponent implements OnInit, OnDestroy {

    // Router subscription
    private routeSub!: Subscription

    constructor(
        private searchService: SearchService,
        private route: ActivatedRoute
    ) {}

    get searchResult$() {
        return this.searchService.searchResult$
    }

    ngOnInit(): void {
        // Subscribes to url changing and make request with new value in url
        this.routeSub = this.route.paramMap.subscribe({
            next: (url: ParamMap) => {
                this.searchService.search(url.get("searchValue") || "")
            }
        })
    }

    ngOnDestroy(): void {
        this.searchService.searchResult$.next([])
        this.routeSub.unsubscribe()
    }
}
