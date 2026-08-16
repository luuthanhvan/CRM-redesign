export interface SalesOrder {
  _id?: string;
  no?: number;
  subject: string;
  contactName: string;
  status: string;
  total: string;
  assignedTo: string;
  creator?: string;
  description: string;
  createdTime?: Date;
  updatedTime?: Date;
};

export interface FilterCriteria {
  subject?: string;
  status?: string;
  assignedTo?: string;
  contactName?: string;
  createdTimeFrom?: object;
  createdTimeTo?: object;
  updatedTimeFrom?: object;
  updatedTimeTo?: object;
}
