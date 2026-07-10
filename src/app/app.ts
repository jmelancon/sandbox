import {Component, OnInit, WritableSignal, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './component/header/header.component';
import {SidebarComponent} from './component/sidebar/sidebar.component';
import {
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent
} from '@angular/material/sidenav';
import {FooterComponent} from './component/footer/footer.component';
import {MatIconRegistry} from '@angular/material/icon';

const ICON_FONT = 'material-symbols-outlined';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        HeaderComponent,
        SidebarComponent,
        MatDrawerContainer,
        MatDrawerContent,
        SidebarComponent,
        MatDrawer,
        FooterComponent
    ],
    template: `
        <app-header (menuClick)="sidebarOpen.set(!sidebarOpen())"/>
        <mat-drawer-container>
            <mat-drawer [opened]="sidebarOpen()" mode="side">
                <app-sidebar/>
            </mat-drawer>
            <mat-drawer-content>
                <main class="mat-body">
                    <router-outlet/>
                </main>
            </mat-drawer-content>
        </mat-drawer-container>
        <app-footer/>
    `,
    styles: `
        mat-drawer-container {
            min-height: calc(100vh - 14rem - 1px);
        }

        mat-drawer {
            width: 18rem;
            border-radius: 0;
            padding: 1rem;
            border-right: 1px solid var(--mat-sys-outline-variant);
        }
    `
})
export class App implements OnInit {
    private readonly iconRegistry: MatIconRegistry = inject(MatIconRegistry);
    protected readonly sidebarOpen: WritableSignal<boolean> = signal(true);

    public ngOnInit() {
        this.iconRegistry.setDefaultFontSetClass(ICON_FONT);
    }
}
