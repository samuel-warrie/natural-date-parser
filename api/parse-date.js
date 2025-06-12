import { parseDate } from 'chrono-node';

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

  const day = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1; // JS months are 0-indexed
  const year = parsedDate.getFullYear();
  const time = parsedDate.toTimeString().split(' ')[0]; // HH:MM:SS

  res.status(200).json({
    day,
    month,
    year,
    time,
    iso: parsedDate.toISOString()
  });
}
