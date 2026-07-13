import { Component, InputSignal, Signal, computed, input } from '@angular/core';

@Component({
    selector: '<app-hex>',
    templateUrl: './hex.component.html',
    styleUrl: './hex.component.css',
})
export class HexComponent{
    /**
     * The content we'd like to display in a hex viewer
     */
    public readonly body: InputSignal<ArrayLike<number>|string>
        = input.required();

    /**
     * The content parsed for rendering in a table
     */
    protected readonly chunks: Signal<number[][]> = computed(() => {
        const body = this.body();
        const content = typeof body === 'string'
            ? body.split('').map(v => v.charCodeAt(0))
            : Array.from(body);
        const chunks: number[][] = [];

        for (let i = 0; i < Math.floor(content.length / 16); i++) {
            chunks.push(content.slice(i * 16, (i + 1) * 16));
        }

        return chunks;
    });

    protected asCharacter(value: number): string {
        const char = String.fromCharCode(value);

        if (!/^(\p{Other}|\p{Space_Separator})$/gu.test(char))
            return char;
        return ' ';
    }
}
