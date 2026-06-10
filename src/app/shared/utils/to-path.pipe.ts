import { Pipe, PipeTransform } from '@angular/core';
import { toPath, RoutePath } from '../../app.paths';

@Pipe({ name: 'toPath' })
export class ToPathPipe implements PipeTransform {
  transform(route: RoutePath): string {
    return toPath(route);
  }
}
