import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { first } from "rxjs"
import { MainData } from "src/app/interfaces/MainData"
import { DataService } from "src/app/_services/data/data.service"

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
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

    constructor(
        private dataService: DataService,
        private router: Router
    ) {}

    // Get all main data via dataService
    public getData() {
        this.dataService
        .getMainData()
        .pipe(first())
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
}
