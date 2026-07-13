import { Component } from '@angular/core';
import { HexComponent } from '../../component/hex/hex.component';

@Component({
    selector: '<app-hex-view>',
    template: `
        <h1>Hex Component Demo</h1>
        <app-hex [body]='demoBody'/>
    `,
    imports: [HexComponent]
})
export class HexViewComponent {
    protected readonly demoBody: ArrayLike<number> = [...Array(256).keys()];
}
