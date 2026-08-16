import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private leadSources = [
    {
      label: 'Existing Customer',
      color: 'purple',
    },
    {
      label: 'Partner',
      color: 'orange',
    },
    {
      label: 'Conference',
      color: 'maroon',
    },
    {
      label: 'Website',
      color: 'blue',
    },
    {
      label: 'Word of mouth',
      color: 'teal',
    },
    {
      label: 'Other',
      color: 'pink',
    },
  ];

  getLeadSrcBadgeColor(leadSrc: string) {
    return this.leadSources.find((item) => item.label === leadSrc)?.color;
  }

  getLeadSrc() {
    return this.leadSources.map((item) => item.label);
  }
}
