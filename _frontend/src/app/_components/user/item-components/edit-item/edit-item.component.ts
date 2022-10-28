import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { first } from "rxjs"
import { Item } from "src/app/interfaces/Item"
import { Message } from "src/app/interfaces/Message"
import { DataService } from "src/app/_services/data/data.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { UserService } from "src/app/_services/user/user.service"

@Component({
    selector: "app-edit-item",
    templateUrl: "./edit-item.component.html",
    styleUrls: ["./edit-item.component.scss"],
})
export class EditItemComponent implements OnInit {
    // Item, which will be edited
    @Input() item!: Item

    // Emits event when edited
    @Output() edited = new EventEmitter()

    // Result of request for tags autocomplete
    public autocompleteResult!: string[]

    constructor(
        private userService: UserService,
        private dataService: DataService,
        private toast: ToastService,
    ) {}

    // Edit item via userService
    public editItem() {
        // Picks only strings like #rare
        this.item.tags = `${this.item.tags}`.match(/#\w+/g)

        this.userService
        .editItem(this.item)
        .pipe(first())
        .subscribe({
            next: (response: Message) => {
                this.toast.success(response.message)
                this.edited.emit()
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
            this.dataService
            .tagAutocomplete(string)
            .pipe(first())
            .subscribe({
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
    public setTag(tag: string, fieldValue: string) {
        let fieldTags = fieldValue.match(/#*\w+/g)
        if (fieldTags) {
            fieldTags.pop()
            fieldTags.push(tag)
            this.item.tags = fieldTags.join(",")
            this.autocompleteResult = []
        }
    }

    ngOnInit(): void {
    }
}
