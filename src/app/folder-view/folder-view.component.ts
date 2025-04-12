import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-folder-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './folder-view.component.html',
})
export class FolderViewComponent implements OnInit {
  slug = '';
  images: string[] = [];
  loading = true;
  folderName: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.fetchFolderMetadata();
    this.fetchImages();
  }

  fetchFolderMetadata() {
    this.http
      .get<{ name: string }>(
        `https://cloud-gallery-api.onrender.com/api/folders/${this.slug}/metadata`
      )
      .subscribe({
        next: (res) => {
          this.folderName = res.name;
        },
        error: (err) => {
          console.error('Failed to fetch folder metadata', err);
          this.folderName = this.slug; // fallback
        },
      });
  }

  fetchImages() {
    this.loading = true;
    this.http
      .get<{ images: { url: string }[] }>(
        `https://cloud-gallery-api.onrender.com/api/images/folder/${this.slug}`
      )
      .subscribe({
        next: (res) => {
          this.images = res.images.map((img) => img.url);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading images:', err);
          this.loading = false;
        },
      });
  }
}
