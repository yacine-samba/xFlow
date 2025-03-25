import Parse from 'parse';

const PARSE_APP_ID = process.env.NEXT_PUBLIC_PARSE_APP_ID;
const PARSE_JS_KEY = process.env.NEXT_PUBLIC_PARSE_JS_KEY;
const PARSE_SERVER_URL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL;

if (!PARSE_APP_ID || !PARSE_JS_KEY || !PARSE_SERVER_URL) {
  console.error('Les variables d\'environnement nécessaires à Parse sont manquantes!');
  process.exit(1);
}

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
Parse.serverURL = PARSE_SERVER_URL;

export default Parse;