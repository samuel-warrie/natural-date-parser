import { parse } from 'chrono-node';
import { DateTime } from 'luxon';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'invalid' });
  }

  const results = parse(text);

  if (!results.length) {
    return res.status(422).json({ error: 'invalid' });
  }

  const parsedDate = results[0].start.date();

  const helsinkiDate = DateTime.fromJSDate(parsedDate, { zone: 'Europe/Helsinki' });

  // Just format year-month-day + offset (for clarity we’ll keep the timezone)
  const formatted = helsinkiDate.toFormat("yyyy-MM-ddZZ");

  res.status(200).json({ date: formatted });
}
