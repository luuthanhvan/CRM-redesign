import { Routes } from '@angular/router';
import { ContactComponent } from './contact.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';

export const contactRoutes: Routes = [
  {
    path: '',
    component: ContactComponent,
    children: [
      { path: '', component: ContactListComponent }, // default content when landing in contact page
      { path: 'contact-details', component: ContactDetailsComponent },
    ],
  },
];
