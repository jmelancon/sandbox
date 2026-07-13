import {
    Component,
    Signal,
    WritableSignal,
    computed,
    inject,
    input,
    signal
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { HexComponent } from '../../component/hex/hex.component';
import {
    DeviceConnectionService
} from '../../service/flirc/device-connection.service';
import { DeviceIoService } from '../../service/flirc/device-io.service';

/*

const GET_VERSION_COMMAND = [
    0x0a, 0xa1, 0x67, 0x76, 0x65, 0x72, 0x73, 0x69,
    0x6f, 0x6e, 0xa0
];

const SET_RING_COMMAND_1 = [
    0x32, 0xa1, 0x63, 0x6c, 0x65, 0x64, 0xa3, 0x68,
    0x61, 0x63, 0x74, 0x69, 0x76, 0x69, 0x74, 0x79,
    0x18, 0x5a, 0x6c, 0x61, 0x63, 0x74, 0x69, 0x76,
    0x69, 0x74, 0x79, 0x2d, 0x6d, 0x61, 0x78, 0x00,
    0x70, 0x61, 0x63, 0x74, 0x69, 0x76, 0x69, 0x74,
    0x79, 0x2d, 0x74, 0x69, 0x6d, 0x65, 0x6f, 0x75,
    0x74, 0x18, 0x1e
];

const SET_RING_COMMAND_2 = [
    0x38, 0xa1, 0x63, 0x6c, 0x65, 0x64, 0xa4, 0x64,
    0x72, 0x69, 0x6e, 0x67, 0x83, 0x18, 0xff, 0x00,
    0x18, 0xff, 0x68, 0x72, 0x69, 0x6e, 0x67, 0x2d,
    0x6d, 0x61, 0x78, 0x00, 0x69, 0x61, 0x6e, 0x69,
    0x6d, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x64, 0x67,
    0x6c, 0x6f, 0x77, 0x6c, 0x72, 0x69, 0x6e, 0x67,
    0x2d, 0x74, 0x69, 0x6d, 0x65, 0x6f, 0x75, 0x74,
    0x0
];

*/

const GET_GPIO_COMMAND = [
    0x07, 0xa1, 0x64, 0x67, 0x70, 0x69, 0x6f, 0xa0
];

@Component({
    selector: '<app-flirc-view>',
    template: `
        @let device = deviceSignal();
        @let report = deviceReportSignal();

        <h1>Flirc Skip 1S Configurator</h1>
        @if(!webHidSupported()) {
            <p>
                Sorry, but your browser does not support the WebHID API.
                Please try again with a Chromium-based browser.
            </p>
        }
        @else if (device && report) {
            <p>Device connected!</p>
            <app-hex [body]='report'/>
        } @else if(device) {
            <p>Device connected, awaiting report...</p>
        } @else {
            <p>
                To begin, please connect your remote, click the button below,
                and select your remote if prompted.
            </p>
            <button matButton (click)="connect()">Connect</button>
        }
    `,
    imports: [MatButton, HexComponent]
})
export class FlircViewComponent {
    public readonly webHidSupported: Signal<boolean>
        = input.required();

    private readonly deviceConnection: DeviceConnectionService
        = inject(DeviceConnectionService);

    protected readonly deviceSignal: Signal<HIDDevice|undefined>
        = computed(() => this.deviceConnection.device());

    protected readonly deviceReportSignal: WritableSignal<ArrayLike<number>>
        = signal([]);

    protected readonly deviceIoService: DeviceIoService
        = inject(DeviceIoService);

    protected async connect(): Promise<void> {
        await this.deviceConnection.connect();

        this.deviceIoService.issueRawRequest(GET_GPIO_COMMAND).then((v) => {
            this.deviceReportSignal.set(v);
        });
    }
}
