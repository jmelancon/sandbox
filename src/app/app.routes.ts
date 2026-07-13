import { Routes } from '@angular/router';
import {
    WebHidSupportedResolver
} from './service/resolver/web-hid-supported.resolver';
import {
    WebUsbSupportedResolver
} from './service/resolver/web-usb-supported.resolver';
import {
    FeatureSupportViewComponent
} from './view/feature-support/feature-support-view.component';
import { FlircViewComponent } from './view/flirc/flirc-view.component';
import { HexViewComponent } from './view/hex/hex-view.component';
import { HomeViewComponent } from './view/home/home-view.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeViewComponent
    },
    {
        path: 'features',
        pathMatch: 'full',
        component: FeatureSupportViewComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
            webUsbSupported: WebUsbSupportedResolver,
            webHidSupportedResolver: WebHidSupportedResolver
        }
    },
    {
        path: 'flirc',
        pathMatch: 'full',
        component: FlircViewComponent,
        resolve: {
            webHidSupported: WebHidSupportedResolver
        }
    },
    {
        path: 'hex',
        pathMatch: 'full',
        component: HexViewComponent
    }
];
