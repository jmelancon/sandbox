import {Component} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: "<app-footer>",
  imports: [
    MatIcon
  ],
  template: `
    <footer class="mat-toolbar">
      <mat-icon>developer_board</mat-icon>
      <a href="https://jmelancon.com">MMXXVI jmelancon</a>
      <a href="#" onclick="alert(':3')">:3</a>
    </footer>
  `,
  styleUrl: 'footer.component.css'
})
export class FooterComponent {}
