import { Component, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms"
import { LangService } from "src/app/_services/language/lang.service"
import { UserService } from "src/app/_services/user/user.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { NgxFileDropEntry, FileSystemFileEntry } from "ngx-file-drop"
import { ActivatedRoute, Router } from "@angular/router"
import { Message } from "src/app/interfaces/Message"
import { DataService } from "src/app/_services/data/data.service"
import { Topics } from "src/app/interfaces/Topics"
import { ItemAdditionalField } from "src/app/interfaces/ItemAdditionalField"
import { first, pipe } from "rxjs"

@Component({
    selector: "app-create-collection",
    templateUrl: "./create-collection.component.html",
    styleUrls: ["./create-collection.component.scss"],
})
export class CreateCollectionComponent implements OnInit {
    // Topics to choose, when create
    public topics!: string[] | undefined

    // Additional item fields
    public itemFields: ItemAdditionalField[] = []

    // Preview of collection photo
    public photoPreview!: string | ArrayBuffer | null

    // Collection photo, which will be uploaded
    public collectionPhoto!: File | undefined

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private toast: ToastService,
        private langService: LangService,
        public dataService: DataService
    ) {}

    // Getting topics to choose
    public getTopics() {
        this.dataService
        .getTopics()
        .pipe(first())
        .subscribe({
            next: (response: Topics) => {
                this.topics = response.topics
            },
            error: (error) => {
                this.toast.error(error.error.message)
                this.router.navigateByUrl("")
            },
        })
    }

    // Adds additional field for items
    public addField() {
        this.itemFields.length < 3
            ? this.itemFields.push({
                    type: "text",
                    name: this.langService.translate("Some name"),
                })
            : null
    }

    // Processes choosed collection photo
    public setPhoto(droppedFile: NgxFileDropEntry) {
        if (
            droppedFile.fileEntry.isFile &&
            droppedFile.fileEntry.name.match(/\w+\.(png|jpg|jpeg|svg)$/gi)
        ) {
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry
            const reader = new FileReader()
            fileEntry.file((file: File) => {
                reader.readAsDataURL(file)
                reader.onload = () => {
                    this.photoPreview = reader.result
                }
                this.collectionPhoto = file
            })
        } else {
            this.toast.error("Invalid file type")
        }
    }

    // Reset preview and photo
    public resetImgPreview() {
        this.photoPreview = null
        this.collectionPhoto = undefined
    }

    // Create collection
    public createCollection(form: NgForm) {
        const formData = new FormData()

        for (let key in form.value) {
            formData.append(key, form.value[key])
        }

        formData.append("itemFields", JSON.stringify(this.itemFields))

        formData.append("collectionPhoto", this.collectionPhoto || "")

        const username = this.route.snapshot.paramMap.get("username")

        if (username) {
            this.userService
            .createCollection(username, formData)
            .pipe(first())
            .subscribe({
                next: (response: Message) => {
                    this.toast.success(response.message)
                    this.router.navigateByUrl(`/user/${username}`)
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                },
            })
        }
    }

    ngOnInit(): void {
        this.getTopics()
    }
}
