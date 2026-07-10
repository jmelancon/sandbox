import { Injectable } from '@angular/core';

const CHAR_CODE_A_LOWER = 0x61;
const CHAR_CODE_X_LOWER = 0x78;

@Injectable({ providedIn: 'root' })
export class PayloadDecoderService {
    public parse(data: string): object {
        const queue = data.split('');
        const obj: Record<string, string> = {};

        while (queue.length) {
            const key = this.consume(queue);
            const value = this.consume(queue);
            obj[key] = value;
        }

        return obj;
    }

    private consume(queue: string[]): string {
        let result = '';

        // Get the first letter on the queue
        const charCode = queue.shift()?.charCodeAt(0);
        if (charCode === undefined)
            throw new Error('Unexpected undefined length when decoding');

        let length = charCode - CHAR_CODE_A_LOWER + 1;

        // Special case - if the charcode is 'x',
        // the next character as a uint is the length.
        if (charCode === CHAR_CODE_X_LOWER) {
            const next = queue.shift()?.charCodeAt(0);
            if (next === undefined)
                throw new Error('Unexpected undefined length when decoding');
            length = next;
        }

        // Shift value off of queue
        for (let i = 0; i < length; i++) {
            const char = queue.shift();
            if (char === undefined)
                throw new Error('Unexpected undefined char when decoding');
            result += char;
        }

        return result;
    }
}
