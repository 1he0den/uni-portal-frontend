import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id: number;
  name: string;
  description: string;
  teacher_id: number;
  credits: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/`);
  }

  createCourse(data: {
    name: string;
    description: string;
    credits: number;
  }): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses/`, data);
  }

  updateCourse(
    id: number,
    data: {
      name: string;
      description: string;
      credits: number;
    }
  ): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}/`, data);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${id}/`);
  }
}