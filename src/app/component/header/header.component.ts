import {Component, output} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';

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
