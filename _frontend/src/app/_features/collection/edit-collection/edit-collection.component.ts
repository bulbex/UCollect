import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core"
import { NgForm } from "@angular/forms"
import { NgxFileDropEntry } from "ngx-file-drop"
import { Subject, first, takeUntil } from "rxjs"
import { Collection } from "src/app/interfaces/Collection"
import { Message } from "src/app/interfaces/Message"
import { Topics } from "src/app/interfaces/Topics"
import { DataService } from "src/app/_services/data/data.service"
import { LangService } from "src/app/_services/language/lang.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { UserService } from "src/app/_services/user/user.service"
import { CollectionService } from "src/app/_services/user/collection.service"

@Component({
    selector: "app-edit-collection",
    templateUrl: "./edit-collection.component.html",
    styleUrls: ["./edit-collection.component.scss"],
})
export class EditCollectionComponent implements OnInit, OnDestroy {
    // Collection to edit
    @Input() collection!: Collection

    // Emits event, when user edited
    @Output() edited = new EventEmitter()

    // Topics to choose
    public topics!: string[] | undefined

    // Preview of dropped photo
    public photoPreview!: string | ArrayBuffer | null

    // Collection photo, which will be uploaded
    public collectionPhoto!: File | string | undefined

    private unsubscribe$ = new Subject<null>()

    constructor(
        public dataService: DataService,
        private toast: ToastService,
        private langService: LangService,
        private collectionService: CollectionService
    ) {}

    // Processes dropped collection photo
    public setPhoto(droppedFile: NgxFileDropEntry) {
        if (
            droppedFile.fileEntry.isFile &&
            droppedFile.fileEntry.name.match(/\.(png|jpg|jpeg|svg)$/gi)
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

    public resetCurrentPhoto() {
        this.collection.photo = ""
        this.collectionPhoto = "clean"
    }

    // Edit collection
    public editCollection(form: NgForm) {
        const formData = new FormData()

        for (let key in form.value) {
            formData.append(key, form.value[key])
        }

        formData.append("_id", this.collection._id)

        formData.append("collectionPhoto", this.collectionPhoto || "")

        this.collectionService
        .editCollection(formData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
            next: (response: Message) => {
                this.toast.success(this.langService.translate(response.message))
                this.resetImgPreview()
                form.resetForm()
                this.edited.emit()
            },
            error: (error) => {
                this.toast.error(
                    this.langService.translate(error.error.message)
                )
            },
        })
    }

    // Getting topics to choose
    public getTopics() {
        this.dataService
        .getTopics()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
            next: (response: Topics) => {
                this.topics = response.topics
            },
            error: (error) => {
                console.log(error)
            },
        })
    }

    ngOnInit(): void {
        this.getTopics()
    }

    ngOnDestroy(): void {
        this.unsubscribe$?.unsubscribe()
    }
}
