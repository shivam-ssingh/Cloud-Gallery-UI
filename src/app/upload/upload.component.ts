import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
})
export class UploadComponent implements OnInit {
  slug: string = '';
  files: File[] = [];
  uploading: boolean = false;
  uploadedImages: string[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.fetchUploadedImages();
  }

  fetchUploadedImages() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<{ images: { url: string }[] }>(
        `http://localhost:3000/api/images/folder/${this.slug}`,
        { headers }
      )
      .subscribe({
        next: (res) => {
          this.uploadedImages = res.images.map((img) => img.url);
        },
        error: (err) => {
          console.error('Fetch images error:', err);
        },
      });
  }

  onFileSelected(event: any) {
    this.files = Array.from(event.target.files);
  }

  async uploadImages() {
    if (!this.files.length) return;

    this.uploading = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    for (const file of this.files) {
      try {
        // 1. Get presigned URL
        const res: any = await this.http
          .post(
            'http://localhost:3000/api/images/upload-url',
            {
              folder_slug: this.slug,
              filename: file.name,
            },
            { headers }
          )
          .toPromise();

        // 2. Upload to S3 using presigned URL
        await fetch(res.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        // 3. Save image metadata
        await this.http
          .post(
            'http://localhost:3000/api/images/save',
            {
              folder_slug: this.slug,
              key: res.key,
            },
            { headers }
          )
          .toPromise();

        this.uploadedImages.push(URL.createObjectURL(file)); // local preview
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }

    this.uploading = false;
    this.files = [];
  }
}
