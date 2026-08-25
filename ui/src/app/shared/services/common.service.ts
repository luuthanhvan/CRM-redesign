import { Injectable, inject, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private router = inject(Router);

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

  navigateToSubScreen(screen: string, queryParams?: {}) {
    this.router.navigate([screen], {
      queryParams,
      queryParamsHandling: 'merge', // keep the query params if they exist
    });
  }

  toggleVisibility(event: MouseEvent, signal: WritableSignal<boolean>) {
    signal.update((prev) => !prev);
    event.preventDefault(); // Prevents form submission if placed inside a form
  }
}
