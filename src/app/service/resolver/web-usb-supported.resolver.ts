import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";

@Injectable({
    providedIn: "root"
})
export class WebUsbSupportedResolver implements Resolve<boolean> {
    resolve(): boolean {
        return "usb" in window.navigator;
    }
}
