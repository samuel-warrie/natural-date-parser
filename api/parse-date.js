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

  const parsedDate = results[0].start.date(); // this gives the proper parsed JS Date

  const helsinkiTime = DateTime.fromJSDate(parsedDate, { zone: 'Europe/Helsinki' })
    .toFormat("yyyy-MM-dd'T'HH:mmZZ");

  res.status(200).json({ date: helsinkiTime });
}
