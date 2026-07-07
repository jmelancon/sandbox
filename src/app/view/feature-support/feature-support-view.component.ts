import {Component, computed, input, Signal} from '@angular/core';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
    MatTable
} from '@angular/material/table';

interface Feature {
    name: string,
    documentation: string,
    available: boolean,
    status?: string
}

@Component({
    selector: "<app-feature-support>",
    imports: [
        MatTable,
        MatHeaderCell,
        MatHeaderCellDef,
        MatColumnDef,
        MatCell,
        MatCellDef,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatRowDef
    ],
    template: `
        <h1>Supported Features</h1>
        <p>The following features are supported by your web browser:</p>

        <mat-table [dataSource]="features()">
            <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let feature">{{ feature.name }}</td>
            </ng-container>
            <ng-container matColumnDef="documentation">
                <th mat-header-cell *matHeaderCellDef>Documentation</th>
                <td mat-cell *matCellDef="let feature">
                    <a [href]="feature.documentation">{{ getDomainName(feature.documentation) }}</a>
                </td>
            </ng-container>
            <ng-container matColumnDef="available">
                <th mat-header-cell *matHeaderCellDef>Available</th>
                <td mat-cell *matCellDef="let feature">{{ feature.available ? "Yes" : "No" }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let feature">{{ feature.status ?? "N/A" }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['name', 'documentation', 'available', 'status']"></tr>
            <tr mat-row *matRowDef="let feature; columns: ['name', 'documentation', 'available', 'status']"></tr>
        </mat-table>
    `
})
export class FeatureSupportViewComponent {
    public webUsbSupported: Signal<boolean> = input.required();

    protected features: Signal<Feature[]> = computed(() => [
        {
            name: "WebUSB",
            documentation: "https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API",
            available: this.webUsbSupported()
        }
    ])

    protected getDomainName(url: string){
        return new URL(url).host;
    }
}
