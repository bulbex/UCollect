import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Subject, first, takeUntil } from "rxjs"
import { Collection } from "src/app/interfaces/Collection"
import { Item } from "src/app/interfaces/Item"
import { ItemAdditionalField } from "src/app/interfaces/ItemAdditionalField"
import { Message } from "src/app/interfaces/Message"
import { DataService } from "src/app/_services/data/data.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { UserService } from "src/app/_services/user/user.service"
import { CollectionService } from "src/app/_services/user/collection.service"
import { CollectionItemsService } from "src/app/_services/user/collection-items.service"

@Component({
    selector: "app-collection",
    templateUrl: "./collection-view.component.html",
    styleUrls: ["./collection-view.component.scss"],
})
export class CollectionViewComponent implements OnInit, OnDestroy {
    // Collection
    public collection!: Collection | undefined

    // Check if current user can modify this collection
    public canModify: boolean = false

    // Additional fields copy for adding item
    public additionalFieldsCopy!: ItemAdditionalField[]

    // Item, which will be edited
    public itemToEdit!: Item

    private unsubscribe$ = new Subject<null>()

    constructor(
        private route: ActivatedRoute,
        public dataService: DataService,
        private collectionService: CollectionService,
        private collectionItemsService: CollectionItemsService,
        public userService: UserService,
        private toast: ToastService
    ) {}

    public setItemToEdit(item: Item) {
        // Copy item and set item to edit
        this.itemToEdit = JSON.parse(JSON.stringify(item))
    }

    public setAdditionalFields() {
        // Copy item fields
        this.additionalFieldsCopy = JSON.parse(
            JSON.stringify(this.collection?.itemFields)
        )

        // Added default values for fields
        this.additionalFieldsCopy?.forEach((field) => {
            if (field.type === "checkbox") {
                return (field.value = "false")
            }
            if (field.type === "number") {
                return (field.value = "0")
            }
            return (field.value = "")
        })
    }

    // Gets collection items via dataService
    public getCollectionItems(sort: string = "addition date") {
        const collectionName = this.route.snapshot.paramMap.get("name")

        if (collectionName) {
            this.dataService
            .getCollection(collectionName, sort)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Collection) => {
                    this.collection = response

                    this.canModify =
                        this.collection?.owner === this.userService.user?._id ||
                        this.userService.user?.role === "ADMIN"

                    this.setAdditionalFields()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                },
            })
        }
    }

    // Delete item via collectionService
    public deleteItem(id: string) {
        this.collectionItemsService
        .deleteItem(id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
            next: (response: Message) => {
                this.toast.success(response.message)
                this.getCollectionItems()
            },
            error: (error) => {
                this.toast.error(error.error.message)
            },
        })
    }

    // Icon for order button
    public order = "down"
    // Make request with sort parameter
    public sortItems(sort: string) {
        switch (sort) {
            case "addition date":
                this.order = "down"
                this.getCollectionItems(sort)
                break
            case "alphabet":
                this.order = "down"
                this.getCollectionItems(sort)
                break
            case "likes":
                this.order = "down"
                this.getCollectionItems(sort)
                break
            case "comments":
                this.order = "down"
                this.getCollectionItems(sort)
                break
            case "order":
                this.collection?.items.reverse()
                this.order === "down" ? (this.order = "up") : (this.order = "down")
                break
        }
    }

    ngOnInit(): void {
        this.getCollectionItems()
    }

    ngOnDestroy(): void {
        this.unsubscribe$?.unsubscribe()
    }
}
