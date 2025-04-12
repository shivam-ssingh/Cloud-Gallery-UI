import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  folders: any[] = [];
  newFolderName = '';
  isPublic = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchFolders();
  }

  fetchFolders() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<{ folders: any[] }>(
        'https://cloud-gallery-api.onrender.com/api/folders',
        { headers }
      )
      .subscribe({
        next: (res) => (this.folders = res.folders),
        error: (err) => console.error('Fetch folders error:', err),
      });
  }

  createFolder() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .post(
        'https://cloud-gallery-api.onrender.com/api/folders',
        {
          name: this.newFolderName,
          is_public: this.isPublic,
        },
        { headers }
      )
      .subscribe({
        next: () => {
          this.newFolderName = '';
          this.isPublic = false;
          this.fetchFolders();
        },
        error: (err) => console.error('Create folder error:', err),
      });
  }

  goToFolder(slug: string) {
    this.router.navigate(['/upload', slug]);
  }
  copyLinkToClipboard() {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => alert('Link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  }

  copyPublicLink(event: MouseEvent, slug: string) {
    event.stopPropagation();
    const publicUrl = `${window.location.origin}/gallery/${slug}`;

    navigator.clipboard
      .writeText(publicUrl)
      .then(() => alert('Public link copied to clipboard!'))
      .catch(() => alert('Failed to copy public link'));
  }
}
