import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  questions: {
    en: { type: String, required: true },
    hi: { type: String },
    bn: { type: String }
  },
  answers: {
    en: { type: String, required: true },
    hi: { type: String },
    bn: { type: String }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  methods: {
    async getTranslation(field, lang) {
      const supportedLanguages = ['en', 'hi', 'bn'];
      if (!supportedLanguages.includes(lang)) {
        lang = 'en';
      }

      const content = this[field][lang] || this[field].en;
      return content;
    }
  }
});

export default mongoose.model('FAQ', faqSchema);