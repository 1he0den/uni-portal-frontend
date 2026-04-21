import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course, CourseService } from '../../services/course';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  courses: Course[] = [];
  errorMessage = '';
  loading = false;

  userRole: string | null = null;

  createErrorMessage = '';
  creating = false;

  editingCourseId: number | null = null;
  actionSuccessMessage = '';

  newCourse = {
    name: '',
    description: '',
    credits: 0
  };

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadCourses();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (res: any) => {
        this.userRole = res.role;
        this.cdr.detectChanges();
      },
      error: () => {
        this.userRole = null;
        this.cdr.detectChanges();
      }
    });
  }

  loadCourses(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.courseService.getCourses().subscribe({
      next: (response) => {
        this.courses = response;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.detail || 'Не удалось загрузить курсы';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createOrUpdateCourse(): void {
    if (!this.newCourse.name || !this.newCourse.description) {
      this.createErrorMessage = 'Заполни название и описание';
      return;
    }

    this.creating = true;
    this.createErrorMessage = '';
    this.actionSuccessMessage = '';
    this.cdr.detectChanges();

    if (this.editingCourseId !== null) {
      this.courseService.updateCourse(this.editingCourseId, this.newCourse).subscribe({
        next: () => {
          this.actionSuccessMessage = 'Курс успешно обновлён';
          this.resetForm();
          this.creating = false;
          this.cdr.detectChanges();
          this.loadCourses();
        },
        error: (error) => {
          this.createErrorMessage =
            error?.error?.detail || 'Не удалось обновить курс';
          this.creating = false;
          this.cdr.detectChanges();
        }
      });

      return;
    }

    this.courseService.createCourse(this.newCourse).subscribe({
      next: () => {
        this.actionSuccessMessage = 'Курс успешно создан';
        this.resetForm();
        this.creating = false;
        this.cdr.detectChanges();
        this.loadCourses();
      },
      error: (error) => {
        this.createErrorMessage =
          error?.error?.detail || 'Не удалось создать курс';
        this.creating = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(course: Course): void {
    this.editingCourseId = course.id;
    this.actionSuccessMessage = '';
    this.createErrorMessage = '';

    this.newCourse = {
      name: course.name,
      description: course.description,
      credits: course.credits
    };

    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.resetForm();
    this.cdr.detectChanges();
  }

  deleteCourse(courseId: number): void {
    const confirmed = window.confirm('Удалить этот курс?');
    if (!confirmed) {
      return;
    }

    this.actionSuccessMessage = '';
    this.createErrorMessage = '';

    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.actionSuccessMessage = 'Курс успешно удалён';
        if (this.editingCourseId === courseId) {
          this.resetForm();
        }
        this.cdr.detectChanges();
        this.loadCourses();
      },
      error: (error) => {
        this.createErrorMessage =
          error?.error?.detail || 'Не удалось удалить курс';
        this.cdr.detectChanges();
      }
    });
  }

  private resetForm(): void {
    this.editingCourseId = null;
    this.newCourse = {
      name: '',
      description: '',
      credits: 0
    };
  }

}