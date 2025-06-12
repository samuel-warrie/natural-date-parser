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

  const result = results[0];
  const components = result.start.knownValues;

  // Fallbacks if missing
  const now = DateTime.now().setZone('Europe/Helsinki');
  const year = components.year ?? now.year;
  const month = components.month ?? now.month;
  const day = components.day ?? now.day;
  const hour = components.hour ?? 0;
  const minute = components.minute ?? 0;

  const dt = DateTime.fromObject(
    { year, month, day, hour, minute },
    { zone: 'Europe/Helsinki' }
  );

  const formatted = dt.toFormat("yyyy-MM-dd'T'HH:mmZZ");

  res.status(200).json({ date: formatted });
}
