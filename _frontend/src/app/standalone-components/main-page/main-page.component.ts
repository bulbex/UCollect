import { Component, OnDestroy, OnInit } from "@angular/core"
import { Router, RouterModule } from "@angular/router"
import { Subject, first, takeUntil } from "rxjs"
import { MainData } from "src/app/interfaces/MainData"
import { DataService } from "src/app/_services/data/data.service"
import { TranslateModule } from "@ngx-translate/core"
import { TagCloudModule } from "angular-tag-cloud-module"
import { NgxFileDropModule } from "ngx-file-drop"
import { CommonModule } from "@angular/common"

@Component({
    selector: "app-main",
    templateUrl: "./main-page.component.html",
    styleUrls: ["./main-page.component.scss"],
    imports: [CommonModule, TranslateModule, TagCloudModule, RouterModule],
    standalone: true
})
export class MainPageComponent implements OnInit, OnDestroy {
    // All main data (tags, collections, items)
    public data!: MainData

    // Options for tags cloud
    public cloudOptions = {
        width: 300,
        overflow: false,
        zoomOnHover: {
            scale: 1.2,
            transitionTime: 0.5,
        },
    }

    private unsubscribe$ = new Subject<null>()

    constructor(
        private dataService: DataService,
        private router: Router
    ) {}

    // Get all main data via dataService
    public getData() {
        this.dataService
        .getMainData()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
            next: (response: MainData) => {
                this.data = response
                // Prepares tags before inserting to the cloud
                this.data.tags = this.data.tags.map((tag) => {
                    return { text: tag, color: "#3032DF" }
                })
            },
            error: (error) => {
                console.log(error)
            },
        })
    }

    // Redirecting to search results page, when user clicks on tag
    public tagClicked(tag: string) {
        this.router.navigateByUrl(`/search/${tag.slice(1)}`)
    }

    ngOnInit(): void {
        this.getData()
    }

    ngOnDestroy(): void {
        this.unsubscribe$?.unsubscribe()
    }
}
