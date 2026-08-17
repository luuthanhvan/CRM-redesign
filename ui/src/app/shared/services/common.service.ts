import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  downloadReport(blobData: Blob, filename = 'report.csv') {
    // Create an internal URL pointing to the binary blob data
    const blob = new Blob([blobData], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = window.URL.createObjectURL(blob);

    // Dynamically spin up a visual link element to trigger downloading behavior
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup the virtual elements
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}
