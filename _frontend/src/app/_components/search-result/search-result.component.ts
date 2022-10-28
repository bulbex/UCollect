import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, ParamMap } from "@angular/router"
import { first, Subscription } from "rxjs"
import { SearchService } from "src/app/_services/search/search.service"

@Component({
    selector: "app-search-result",
    templateUrl: "./search-result.component.html",
    styleUrls: ["./search-result.component.scss"],
})
export class SearchResultComponent implements OnInit, OnDestroy {

    // Router subscription
    private routeSub!: Subscription

    constructor(
        public searchService: SearchService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Subscribes to url changing and make request with new value in url
        this.routeSub = this.route.paramMap.subscribe({
            next: (url: ParamMap) => {
                this.searchService.search(url.get("searchValue") || "")
            }
        })
    }

    ngOnDestroy(): void {
        this.searchService.searchResult = []
        this.routeSub.unsubscribe()
    }
}
