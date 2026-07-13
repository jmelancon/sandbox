import { Injectable, inject } from '@angular/core';
import {
    Observable,
    debounceTime,
    first,
    firstValueFrom,
    map,
    scan,
    timeout
} from 'rxjs';
import { ResponsePacket } from '../../model/flirc/response-packet.model';
import { DeviceConnectionService } from './device-connection.service';
import { PayloadDecoderService } from './payload-decoder.service';
import { PayloadEncoderService } from './payload-encoder.service';

@Injectable({providedIn: 'root'})
export class DeviceIoService{
    private readonly deviceConnection: DeviceConnectionService
        = inject(DeviceConnectionService);

    private readonly payloadEncoder: PayloadEncoderService
        = inject(PayloadEncoderService);

    private readonly payloadDecoder: PayloadDecoderService
        = inject(PayloadDecoderService);

    public async issueRequest(): Promise<ResponsePacket[]> {
        throw new Error('bruh');
    }

    public async issueRawRequest(
        content: ArrayLike<number>
    ): Promise<ArrayLike<number>> {
        const device = this.deviceConnection.device();
        if (!device)
            throw new Error('Device is not currently connected!');

        const buf = new ArrayBuffer(64);
        const view = new Uint8Array(buf);
        view.fill(0xff);
        view.set(content);

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
            timeout(75),
            debounceTime(50),
            timeout(500),
            first()
        );

        device.sendReport(0x02, buf);
        return await firstValueFrom(
            response.pipe(
                map(
                    data => data ? new Uint8Array(data) : []
                )
            )
        );
    }
}
