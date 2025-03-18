import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatTimeAgo(timestamp: string): string {
    if (!timestamp) return '';
    return dayjs(timestamp).fromNow();
}