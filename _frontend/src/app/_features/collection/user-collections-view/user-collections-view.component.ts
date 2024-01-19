import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { first, Subject, Subscription, takeUntil } from "rxjs"
import { Collection } from "src/app/interfaces/Collection"
import { Message } from "src/app/interfaces/Message"
import { AuthService } from "src/app/_services/authentication/auth.service"
import { DataService } from "src/app/_services/data/data.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { UserService } from "src/app/_services/user/user.service"
import { CollectionService } from "src/app/_services/user/collection.service"

@Component({
    selector: "app-user-collections",
    templateUrl: "./user-collections-view.component.html",
    styleUrls: ["./user-collections-view.component.scss"]
})
export class UserCollectionsViewComponent implements OnInit, OnDestroy {
    // User collections
    public collections!: Collection[] | undefined

    // Collection , which will be edited
    public collectionToEdit!: Collection

    private unsubscribe$ = new Subject<null>()

    constructor(
        public authService: AuthService,
        public collectionService: CollectionService,
        public dataService: DataService,
        private route: ActivatedRoute,
        private router: Router,
        private toast: ToastService
    ) {}

    // Get all user collections
    public username!: string 
    public getUserCollections() {
        this.username = this.route.snapshot.paramMap.get("username") || ""
        if (this.username) {
            this.collectionService
            .getUserCollections(this.username)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Collection[]) => {
                    this.collections = response
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                    this.router.navigateByUrl("")
                },
            })
        }
    }

    // Delete collection by id
    public deleteCollection(id: string) {
        this.collectionService
        .deleteCollection(id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
            next: (response: Message) => {
                this.toast.success(response.message)
                this.getUserCollections()
            },
            error: (error) => {
                this.toast.error(error.error.message)
            },
        })
    }

    // Sets collection to edit
    public setCollectionToEdit(collection: Collection) {
        this.collectionToEdit = JSON.parse(JSON.stringify(collection))
    }

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: () => {
                this.getUserCollections()
            }
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe$?.unsubscribe()
    }
}
