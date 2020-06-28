import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ApiService } from './api.service';

declare let $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class AppComponent implements OnInit {
    location: any;
    routerSubscription: any;
    loginbtn:boolean;
logoutbtn:boolean;
    constructor(private router: Router, private dataService: ApiService) {
        dataService.getLoggedInName.subscribe(name => this.changeName(name));
        if(this.dataService.isLoggedIn())
        {
        console.log("loggedin");
        this.loginbtn=false;
        this.logoutbtn=true
        }
        else{
        this.loginbtn=true;
        this.logoutbtn=false
        }
    }
    
    private changeName(name: boolean): void {
        this.logoutbtn = name;
        this.loginbtn = !name;
        }
        logout()
        {
        this.dataService.deleteToken();
        window.location.href = window.location.href;
        }

    ngOnInit(){
        this.recallJsFuntions();
    }

    recallJsFuntions() {
        this.router.events
        .subscribe((event) => {
            if ( event instanceof NavigationStart ) {
                $('.preloader').fadeIn('slow');
            }
        });
        this.routerSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
        .subscribe(event => {
            $.getScript('../assets/js/main.js');
            $('.preloader').fadeOut('slow');
            this.location = this.router.url;
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }
}