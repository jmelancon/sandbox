import { Component, output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: '<app-header>',
    imports: [
        MatToolbar,
        MatIcon,
        MatButton,
        RouterLink,
        RouterLinkActive,
        MatIconButton
    ],
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.css',
})
export class HeaderComponent {
    public readonly menuClick = output<MouseEvent>();
}
