import { parse } from 'chrono-node';
import { DateTime } from 'luxon';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing "text" in request body' });
  }

  const results = parse(text);

  if (!results.length) {
    return res.status(422).json({ error: 'Could not parse date' });
  }

  const parsedDate = results[0].start.date();
  const parsedTime = results[0].start.time(); // Extract the time component if available

  const helsinkiDate = DateTime.fromJSDate(parsedDate, { zone: 'Europe/Helsinki' });

  // If a time is provided, use it; otherwise, default to 00:00
  let finalDateTime;
  if (parsedTime) {
    // Combine the parsed date with the user's time
    finalDateTime = helsinkiDate.set({
      hour: parsedTime.getHours(),
      minute: parsedTime.getMinutes(),
      second: 0,
      millisecond: 0
    });
  } else {
    // Default to midnight if no time is specified
    finalDateTime = helsinkiDate.startOf('day');
  }

  // Format as full ISO 8601 string with Helsinki offset
  const formatted = finalDateTime.toISO({ includeOffset: true });

  res.status(200).json({ date: formatted });
}
