import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { first, Subscription } from "rxjs"
import { Collection } from "src/app/interfaces/Collection"
import { Message } from "src/app/interfaces/Message"
import { AuthService } from "src/app/_services/authentication/auth.service"
import { DataService } from "src/app/_services/data/data.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { UserService } from "src/app/_services/user/user.service"

@Component({
    selector: "app-user-collections",
    templateUrl: "./user-collections.component.html",
    styleUrls: ["./user-collections.component.scss"],
})
export class UserCollectionsComponent implements OnInit, OnDestroy {
    // User collections
    public collections!: Collection[] | undefined

    // Collection , which will be edited
    public collectionToEdit!: Collection

    // Route subscription
    public routeSub!: Subscription

    constructor(
        public authService: AuthService,
        public userService: UserService,
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
            this.userService
            .getUserPage(this.username)
            .pipe(first())
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
        this.userService
        .deleteCollection(id)
        .pipe(first())
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
        // Subscribes for url changing (useful for admins)
        this.routeSub = this.route.paramMap.subscribe({
            next: () => {
                this.getUserCollections()
            }
        })
    }

    ngOnDestroy(): void {
        this.routeSub.unsubscribe()
    }
}
