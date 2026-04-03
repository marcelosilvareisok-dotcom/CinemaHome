import fs from 'fs';
import https from 'https';

https.get('https://embedmovies.org/documentacao', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    // extract code blocks or iframe examples
    const iframes = data.match(/<iframe[^>]+>/g);
    console.log("IFRAMES:", iframes);
    const codes = data.match(/<code>.*?<\/code>/g);
    console.log("CODES:", codes);
  });
});
