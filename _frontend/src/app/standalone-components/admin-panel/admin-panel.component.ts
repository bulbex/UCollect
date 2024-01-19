import { Component, OnDestroy, OnInit } from "@angular/core"
import { Router, RouterModule } from "@angular/router"
import { Subject, first, takeUntil } from "rxjs"
import { Message } from "src/app/interfaces/Message"
import { User } from "src/app/interfaces/User"
import { AdminService } from "src/app/_services/admin/admin.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { UserService } from "src/app/_services/user/user.service"
import { TranslateModule } from "@ngx-translate/core"
import { CommonModule } from "@angular/common"

@Component({
    selector: "app-admin-panel",
    templateUrl: "./admin-panel.component.html",
    imports: [CommonModule, RouterModule, TranslateModule],
    standalone: true
})
export class AdminPanelComponent implements OnInit, OnDestroy {
    // Users, which aro going to be modified
    public usersToModify: string[] = []

    private unsubscribe$ = new Subject<null>()

    constructor(
        private adminService: AdminService,
        private toast: ToastService,
        private userService: UserService,
        private router: Router
    ) {}

    get allUsers$() {
        return this.adminService.allUsers$
    }

    // Toggle users, which are going to be modified
    public toggleUserToModify(id: string) {
        let index = this.usersToModify.findIndex((userId) => userId === id)
        index === -1 ? this.usersToModify.push(id) : this.usersToModify.splice(index, 1)
    }

    // Getting all users via adminService
    public getAllUsers() {
        this.adminService
        .getUsers()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
            next: (response: User[]) => {
                this.allUsers$.next(response)
            },
            error: (error) => {
                this.toast.error(error.error.message)
                this.userService.getUserData()
                this.router.navigateByUrl("")
            },
        })
    }

    // Unblock users
    public unblock() {
        if (this.usersToModify.length) {
            this.adminService
            .unblock(this.usersToModify)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Message) => {
                    this.toast.success(response.message)
                    this.usersToModify = []
                    this.getAllUsers()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                    this.router.navigateByUrl("")
                },
            })
        }
    }

    // Block users
    public block() {
        if (this.usersToModify.length) {
            this.adminService
            .block(this.usersToModify)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Message) => {
                    this.toast.success(response.message)
                    this.usersToModify = []
                    this.getAllUsers()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                    this.router.navigateByUrl("")
                },
            })
        }
    }

    // Delete users
    public delete() {
        if (this.usersToModify.length) {
            this.adminService
            .delete(this.usersToModify)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Message) => {
                    this.toast.success(response.message)
                    this.usersToModify = []
                    this.getAllUsers()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                    this.router.navigateByUrl("")

                },
            })
        }
    }

    // Adding users to admins
    public makeAdmin() {
        if (this.usersToModify.length) {
            this.adminService
            .makeAdmin(this.usersToModify)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Message) => {
                    this.toast.success(response.message)
                    this.usersToModify = []
                    this.getAllUsers()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                    this.router.navigateByUrl("")

                },
            })
        }
    }

    // Delete users from admins
    public deleteFromAdmin() {
        if (this.usersToModify.length) {
            this.adminService
            .deleteAdmin(this.usersToModify)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Message) => {
                    this.toast.success(response.message)
                    this.usersToModify = []
                    this.getAllUsers()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                    this.router.navigateByUrl("")

                },
            })
        }
    }

    // Getting all users on init
    ngOnInit(): void {
        this.getAllUsers()
    }

    ngOnDestroy(): void {
        this.unsubscribe$?.unsubscribe()
    }
}
