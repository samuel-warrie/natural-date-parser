import { parseDate } from 'chrono-node';
import { DateTime } from 'luxon';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing "text" in request body' });
  }

  const parsedDate = parseDate(text);
  if (!parsedDate) {
    return res.status(422).json({ error: 'Could not parse date' });
  }

  const helsinkiTime = DateTime.fromJSDate(parsedDate, { zone: 'Europe/Helsinki' }).toISO();

  res.status(200).json({ date: helsinkiTime });
}
