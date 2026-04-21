import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user.model.ts';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  errorMessage = '';
  loading = true;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Profile component loaded');

    this.authService.getProfile().subscribe({
      next: (data) => {
        console.log('PROFILE DATA:', data);
        this.user = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('PROFILE ERROR:', err);
        this.errorMessage = err?.error?.detail || 'Failed to load profile';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}