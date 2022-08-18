import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
// to make sure that the interceptor is used only on the routes that are decorated with @Serilaize

// to make sure that the anything passed to serialize is an instance of the class that is decorated with @Serilaize
interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serilaize(dto: ClassConstructor) {
  return UseInterceptors(new SerilaizeInterceptor(dto));
}

export class SerilaizeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // run something before the request is handled by request handler (before the return statement)
    // console.log('Before request', context);

    return next.handle().pipe(
      map((data: any) => {
        // run something after the request is handled by request handler and before response is sent
        // console.log('After request', data);

        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // make sure every field is included in the respons
        });
      }),
    );
  }
}
