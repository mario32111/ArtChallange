// image-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private readonly apiKey = 'f6b1133859231f68cdceda9ad600eace'; // Tu API key de ImgBB
  private readonly uploadUrl = 'https://api.imgbb.com/1/upload';

  constructor(private http: HttpClient  ) { }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);

    // Puedes agregar parámetros adicionales como expiration si lo necesitas
    const params = {
      key: this.apiKey,
      // expiration: '600' // Opcional: tiempo en segundos para que la imagen expire
    };

    const data = this.http.post(this.uploadUrl, formData, { params });
    //console.log(data);
    return data;
    }
}
