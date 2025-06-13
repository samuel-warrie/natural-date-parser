import chrono from 'chrono-node';
import { DateTime } from 'luxon';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing date text' });
  }

  try {
    const parsedDate = chrono.en.parseDate(text, new Date());

    if (!parsedDate) {
      return res.status(422).json({ error: 'Could not parse a valid date' });
    }

    const helsinkiDate = DateTime.fromJSDate(parsedDate, { zone: 'Europe/Helsinki' });
    const formatted = helsinkiDate.toFormat("yyyy-MM-ddZZ");

    return res.status(200).json({ date: formatted });
  } catch (err) {
    console.error('Date parsing error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
