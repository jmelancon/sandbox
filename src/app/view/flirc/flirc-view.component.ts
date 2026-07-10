import { Component, Signal, WritableSignal, computed, inject, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Observable, debounceTime, first, scan } from 'rxjs';
import { PayloadDecoderService } from '../../service/flirc/payload-decoder.service';
import { VersionModel } from '../../model/flirc/version.model';
import { DeviceConnectionService } from '../../service/flirc/device-connection.service';

const GET_VERSION_COMMAND = [0x0a, 0xa1, 0x67, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0xa0];

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
            <pre><code>{{report}}</code></pre>
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
    imports: [MatButton]
})
export class FlircViewComponent {
    public readonly webHidSupported: Signal<boolean>
        = input.required();

    private readonly payloadLexer: PayloadDecoderService
        = inject(PayloadDecoderService);

    private readonly deviceConnection: DeviceConnectionService
        = inject(DeviceConnectionService);

    protected readonly deviceSignal: Signal<HIDDevice|undefined>
        = computed(() => this.deviceConnection.device());

    protected readonly deviceReportSignal: WritableSignal<string|undefined>
        = signal(undefined);

    protected async connect(): Promise<void> {
        const device = await this.deviceConnection.connect();

        const buf = new ArrayBuffer(64);
        const view = new Uint8Array(buf);
        view.fill(0xff);
        view.set(GET_VERSION_COMMAND);

        const collect = new Observable<HIDInputReportEvent>((subscriber) => {
            device.addEventListener('inputreport', (event) => {
                subscriber.next(event);
            });
        });

        const accumulator = function (
            acc: Uint8Array<ArrayBuffer> | undefined,
            curr: HIDInputReportEvent
        ) {
            if (acc === undefined)
                return;

            console.log('bruh');

            const lastLength = acc.byteLength;
            const payloadLength = curr.data.byteLength - 1;
            const payload = new Uint8Array(curr.data.buffer.slice(1));

            // Increase buffer sized, append new data
            acc.buffer.resize(lastLength + payloadLength);
            acc.set(payload, lastLength);
            return acc;
        };

        const response = collect.pipe(
            scan(
                accumulator,
                new Uint8Array(
                    new ArrayBuffer(0, { maxByteLength: 4096 })
                )
            ),
            debounceTime(100),
            first()
        );
        response.subscribe((data) => {
            this.deviceReportSignal.set(undefined);
            if (data) {
                const decoder = new TextDecoder();
                const decoded = decoder.decode(
                    data.buffer.transferToFixedLength()
                );
                this.deviceReportSignal.set(decoded);
                console.log(VersionModel.FromObject(this.payloadLexer.parse(decoded.slice(3, decoded.length - 60))));
            }
        });

        device.sendReport(0x02, buf);
    }
}
