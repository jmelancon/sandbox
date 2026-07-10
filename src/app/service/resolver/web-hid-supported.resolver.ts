import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class WebHidSupportedResolver implements Resolve<boolean> {
    resolve(): boolean {
        return 'hid' in window.navigator;
    }
}
