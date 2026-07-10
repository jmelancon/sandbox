import { Component } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import {
    IsActiveMatchOptions,
    RouterLink,
    RouterLinkActive
} from '@angular/router';
import { MatIcon } from '@angular/material/icon';

interface RouteLink {
    name: string,
    path: string,
    icon: string,
    routerLinkActiveOptions?: IsActiveMatchOptions
}

@Component({
    selector: '<app-sidebar>',
    imports: [
        MatNavList,
        MatListItem,
        RouterLink,
        RouterLinkActive,
        MatIcon,
    ],
    template: `
        <mat-nav-list>
            @for (link of routes; track link.path) {
                <a
                    mat-list-item
                    [routerLink]="link.path"
                    routerLinkActive="mdc-list-item--activated"
                    [routerLinkActiveOptions]="
                        link.routerLinkActiveOptions ?? {exact: true}
                    "
                >
                    <div class="sidebar-button-contents">
                        <mat-icon>{{ link.icon }}</mat-icon>
                        {{ link.name }}
                    </div>
                </a>
            }
        </mat-nav-list>
    `,
    styles: `
        mat-nav-list {
            min-height: calc(100% - 12rem - 1px);

            .sidebar-button-contents {
                display: flex;
                gap: 0.5rem;
            }
        }

        [mat-list-item]:not(:last-child) {
            margin-bottom: 0.5rem;
        }
    `
})
export class SidebarComponent {
    protected readonly routes: RouteLink[] = [
        {
            name: 'Supported Features',
            icon: 'monitor_heart',
            path: '/features'
        },
        {
            name: 'Flirc Skip 1S',
            icon: 'remote_gen',
            path: '/flirc'
        }
    ];
}
