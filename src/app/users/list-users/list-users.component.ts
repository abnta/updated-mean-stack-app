import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
    templateUrl: './list-users.component.html',
    styleUrls: ['./list-users.component.css']
})

export class ListUsersComponent implements OnInit, OnDestroy {
    fetchedUsers: User[] = [];
    fetchUsersSub: Subscription;
    userSubs: Subscription;
    isEditMode: boolean = false;
    _id: string;
    role: string;
    isLoading:boolean = false;

    constructor(private userService: UserService, private router: Router, private authService: AuthService) { }
    ngOnInit() {
        this.isLoading = true;
        this.userService.getUsers().subscribe((response) => {
            if(response.message == 'success' && response.error== null){
                this.fetchedUsers = response.data;
                this.isLoading = false;
            }else{
                this.isLoading = false;
                alert(response.message + ' : ' + response.error)
            }
        })

        this.fetchUsersSub = this.userService.usersChanged.subscribe((response) => {
            this.isLoading = false;
            this.fetchedUsers = response
        })

        this._id = this.authService._id;
        this.role = this.authService.role;

        this.userSubs = this.authService.userChnanged.subscribe(() => {
            this.isLoading = false;
            this._id = this.authService._id;
            this.role = this.authService.role;
        })

    }

    onDelete(id: string) {
        this.userService.deleteUser(id).subscribe((response) => {
            console.log(response)
            if(response.message=='success' && response.error==null){
                this.userService.fetchUsersList()
            }else{
                alert(response.message + ' : '+ response.error);
            }
            
        })
    }

    onEdit(user: User) {
        this.userService.editData.next(user)
        this.router.navigate(['/edit', user._id])
    }

    disableLink(user) {
        if ((user._id == this._id) && this.role == 'user') {
            return false
        } else if (this.role == 'admin') {
            return false
        } else {
            return true
        }
    }

    ngOnDestroy() {
        this.fetchUsersSub.unsubscribe()
    }



}