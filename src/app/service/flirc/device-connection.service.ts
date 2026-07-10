import {
    Injectable,
    Signal,
    WritableSignal,
    computed,
    signal
} from '@angular/core';

const DEVICE_FILTERS: HIDDeviceFilter[] = [
    { vendorId: 0x20a0, productId: 0x0008 }
] ;

@Injectable({ providedIn: 'root' })
export class DeviceConnectionService {
    /**
     * The device connection. The goal is to keep this defined only while fully
     * connected.
     */
    private readonly deviceSignal: WritableSignal<HIDDevice | undefined>
        = signal(undefined);

    /**
     * Public property that allows others to access a read-only copy of
     * deviceSignal
     */
    public readonly device: Signal<HIDDevice | undefined>
        = computed(() => this.deviceSignal());

    public async connect(): Promise<HIDDevice> {
        // Clean up if a device already exists
        this.disconnect();

        const devices: HIDDevice[] = await navigator.hid.requestDevice(
            { filters: DEVICE_FILTERS }
        );

        if (devices.length === 0)
            throw new Error('No devices returned :(');

        if (devices.length > 1)
            throw new Error(
                'Why the hell do you have two remotes plugged in? Weirdo.'
            );

        const device: HIDDevice = devices[0];
        await device.open();

        // Set up our device's signal and make sure we clean up on disconnect
        this.deviceSignal.set(device);
        navigator.hid.addEventListener(
            'disconnect',
            () => this.deviceSignal.set(undefined),
            {once: true}
        );

        return device;
    }

    public async disconnect(): Promise<void> {
        this.deviceSignal()?.close();
        this.deviceSignal.set(undefined);
    }
}
