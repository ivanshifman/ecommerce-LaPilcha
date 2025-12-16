import { formatInTimeZone } from 'date-fns-tz';

export class DateFormatUtil {
  private static readonly TIMEZONE = 'America/Argentina/Buenos_Aires';

  static toLocalISO(date: Date | undefined): string | undefined {
    if (!date) return undefined;
    return formatInTimeZone(date, this.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  }

  static toReadable(date: Date | undefined): string | undefined {
    if (!date) return undefined;
    return formatInTimeZone(date, this.TIMEZONE, 'dd/MM/yyyy HH:mm');
  }
}
