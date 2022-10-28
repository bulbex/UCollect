import { Component, OnDestroy, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms"
import { ActivatedRoute } from "@angular/router"
import { first } from "rxjs"
import { Comment } from "src/app/interfaces/Comment"
import { Item } from "src/app/interfaces/Item"
import { DataService } from "src/app/_services/data/data.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { UserService } from "src/app/_services/user/user.service"

@Component({
    selector: "app-item",
    templateUrl: "./item.component.html",
    styleUrls: ["./item.component.scss"],
})
export class ItemComponent implements OnInit, OnDestroy {

    // Item
    public item!: Item | undefined

    // Is current user can comment this item?
    public canComment: boolean = false

    // Is current user liked this item?
    public liked: boolean = false

    constructor(
        private dataService: DataService,
        public userService: UserService,
        private toast: ToastService,
        private route: ActivatedRoute
    ) {}

    // Get item via dataService
    public getItem() {
        let itemId = this.route.snapshot.paramMap.get("itemId")
        if (itemId) {
            this.dataService
            .getItem(itemId)
            .pipe(first())
            .subscribe({
                next: (response: Item) => {
                    this.item = response
                    if (this.userService.user) {
                        this.canComment = !this.item.comments.find((comment) => {
                            return comment.author === this.userService.user?.username
                        })
                        this.liked = this.item.likes.includes(this.userService.user._id)
                    }
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                },
            })
        }
    }

    // Write comment request
    public writeComment(form: NgForm) {
        if (this.item) {
            this.userService
            .comment(form.value, this.item._id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.getItemFeedback()
                    form.resetForm()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                },
            })
        }
    }

    public toggleLike() {
        if (this.item) {
            this.userService
            .toggleLike(this.item._id)
            .pipe(first())
            .subscribe({
                next: (response: string[]) => {
                    if (this.userService.user && this.item) {
                        this.item.likes = response
                        this.liked =
                            this.item?.likes.includes(this.userService.user._id) || false
                    }
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                },
            })
        }
    }

    public getItemFeedback() {
        if (this.item) {
            this.dataService
            .getItemFeedback(this.item._id)
            .pipe(first())
            .subscribe({
                next: (response: { comments: Comment[]; likes: string[] }) => {
                    if (this.item) {
                        this.item.comments = response.comments
                        this.item.likes = response.likes
                        if (this.userService.user) {
                            this.canComment = !this.item.comments.find((comment) => {
                                return comment.author === this.userService.user?.username
                            })
                            this.liked = this.item.likes.includes(this.userService.user._id)
                        }
                    }
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                },
            })
        }
    }

    public feedbackInterval!: any
    ngOnInit(): void {
        this.getItem()
        this.feedbackInterval = setInterval(() => this.getItemFeedback(), 5000)
    }

    ngOnDestroy(): void {
        clearInterval(this.feedbackInterval)
    }
}
