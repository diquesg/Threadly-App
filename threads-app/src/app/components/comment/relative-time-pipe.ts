import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'relativeTime',
    standalone: true
})
export class RelativeTimePipe implements PipeTransform {
    transform(value: string | Date): string {
        const date = new Date(value);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();


        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSeconds < 60) {
            return `${diffSeconds}s`;
        } else if (diffMinutes < 60) {
            return `${diffMinutes}m`;
        } else if (diffHours < 24) {
            return `${diffHours}h`;
        } else {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        }
    }
}
