import { Routes } from '@angular/router';
import {HomeViewComponent} from './view/home/home-view.component';
import {FeatureSupportViewComponent} from './view/feature-support/feature-support-view.component';

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
        runGuardsAndResolvers: "always"
    }
];
