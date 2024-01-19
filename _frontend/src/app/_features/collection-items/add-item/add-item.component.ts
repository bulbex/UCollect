import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core"
import { NgForm } from "@angular/forms"
import { Subject, first, takeUntil } from "rxjs"
import { ItemAdditionalField } from "src/app/interfaces/ItemAdditionalField"
import { Message } from "src/app/interfaces/Message"
import { DataService } from "src/app/_services/data/data.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { UserService } from "src/app/_services/user/user.service"
import { CollectionItemsService } from "src/app/_services/user/collection-items.service"

@Component({
    selector: "app-add-item",
    templateUrl: "./add-item.component.html",
    styleUrls: ["./add-item.component.scss"],
})
export class AddItemComponent implements OnInit, OnDestroy {

    // Additional fields
    @Input() additionalFields!: ItemAdditionalField[] | undefined

    // Id of parent collection
    @Input() parentId!: string

    // Emits event when added
    @Output() addedItem = new EventEmitter()

    // Result of request for tags autocomplete
    public autocompleteResult!: string[] | undefined

    private unsubscribe$ = new Subject<null>()

    constructor(
        private collectionItemsService: CollectionItemsService,
        private dataService: DataService,
        private toast: ToastService
    ) {}

    public addItem(form: NgForm) {
        let item = {
            parent: this.parentId,
            name: form.value.name,
            tags: form.value.tags.match(/#\w+/g),
            additionalFields: this.additionalFields,
        }
        this.collectionItemsService
        .addItem(item)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
            next: (response: Message) => {
                this.toast.success(response.message)
                this.addedItem.emit()
                form.resetForm()
            },
            error: (error) => {
                this.toast.error(error.error.message)
            },
        })
    }

    // Tags autocomplete request
    public autocompleteTimeout!: any
    public autocomplete(string: string) {
        
        string = string.match(/\w+/g)?.pop() || ""

        clearTimeout(this.autocompleteTimeout)

        this.autocompleteTimeout = setTimeout(() => {
            this.dataService.tagAutocomplete(string).subscribe({
                next: (response: string[]) => {
                    this.autocompleteResult = response.reverse()
                },
                error: (error) => {
                    console.log(error)
                },
            })
        }, 500)

    }

    // Sets chosen tags from autocomplete
    public chosenTags = ""
    public setTag(tag: string, fieldValue: string) {
        let fieldTags = fieldValue.match(/#*\w+/g)
        if (fieldTags) {
            fieldTags.pop()
            fieldTags.push(tag)
            this.chosenTags = fieldTags.join(",")
            this.autocompleteResult = []
        }
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.unsubscribe$?.unsubscribe()
    }
}
