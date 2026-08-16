export interface Contact {
  _id?: string;
  no?: Number;
  contactName: string;
  salutation: string;
  mobilePhone: string;
  email: string;
  organization: string;
  dob: string;
  leadSrc: string;
  assignedTo: string;
  creator?: string;
  address: string;
  mapsURL?: string | null;
  description: string;
  createdTime?: Date;
  updatedTime?: Date;
}

export interface FilterCriteria {
  leadSrc?: string;
  assignedTo?: string;
  contactName?: string;
  createdTimeFrom?: object;
  createdTimeTo?: object;
  updatedTimeFrom?: object;
  updatedTimeTo?: object;
}
