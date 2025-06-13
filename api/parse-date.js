import { parse } from 'chrono-node';
import { DateTime } from 'luxon';

// Custom refiner to handle "next week [day]" more accurately
const customChrono = chrono.casual.clone();
customChrono.refiners.push({
  refine: (context, results) => {
    results.forEach((result) => {
      const text = result.text.toLowerCase();
      if (text.includes('next week')) {
        // Force "next week [day]" to mean the specified day in the following week
        const refDate = DateTime.fromJSDate(context.refDate, { zone: 'Europe/Helsinki' });
        const targetDay = result.start.knownValues.day || result.start.impliedValues.day;
        const targetWeekday = result.start.knownValues.weekday;

        if (targetWeekday !== undefined) {
          // Calculate the next week's Monday
          const nextWeek = refDate.plus({ weeks: 1 }).startOf('week');
          // Adjust to the specified weekday (0 = Sunday, 1 = Monday, etc.)
          const adjustedDate = nextWeek.plus({ days: targetWeekday });
          result.start.assign('day', adjustedDate.day);
          result.start.assign('month', adjustedDate.month);
          result.start.assign('year', adjustedDate.year);
        }
      }
    });
    return results;
  },
});

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  // Parse with custom chrono instance, using current Helsinki time as reference
  const now = DateTime.now().setZone('Europe/Helsinki').toJSDate();
  const results = customChrono.parse(text, now);

  if (!results.length) {
    return res.status(422).json({ error: 'Could not parse date from input' });
  }

  const parsedDate = results[0].start.date();
  if (!parsedDate) {
    return res.status(422).json({ error: 'Invalid date parsed' });
  }

  const helsinkiDate = DateTime.fromJSDate(parsedDate, { zone: 'Europe/Helsinki' });
  const formatted = helsinkiDate.toFormat('yyyy-MM-ddZZ');

  res.status(200).json({ date: formatted });
}
