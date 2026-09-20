import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Exemplo de adição de Headers (Clean Code / API Modernization)
  const apiReq = req.clone({
    setHeaders: {
      'X-App-Version': '1.0.0',
      'Content-Type': 'application/json'
      // 'Authorization': `Bearer ${token}` -> Caso implementemos auth depois
    }
  });

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Tratamento de Erros e Resiliência (Offline-first / Fallbacks)
      if (error.status === 0 || !navigator.onLine) {
        console.error('Sem conexão com a internet ou servidor fora do ar.');
        router.navigate(['/desconectado']);
      } else if (error.status === 401 || error.status === 403) {
        console.error('Erro de Autenticação/Autorização');
        // Redirecionar para login (futuro)
      } else if (error.status >= 500) {
        console.error('Erro no servidor interno', error);
      }
      return throwError(() => error);
    })
  );
};
