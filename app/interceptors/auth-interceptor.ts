import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthRequest =
    req.url.includes('/auth/login/') ||
    req.url.includes('/auth/refresh/');

  if (isAuthRequest) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq);
  }

  return next(req);
};