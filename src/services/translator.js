import dotenv from 'dotenv';
dotenv.config();
import { v2 as translateLib } from '@google-cloud/translate';
const translate = new translateLib.Translate({ key: process.env.GOOGLE_CLOUD_API_KEY });
// console.log(process.env);
//GOOGLE_CLOUD_API_KEY

const translationService = {
  async translateText(text, targetLang) {
    try {
      const [translation] = await translate.translate(text, targetLang);
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    }
  }
};

export default translationService;