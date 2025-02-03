import express from 'express';
const router = express.Router();
import { body, query, validationResult } from 'express-validator';
import FAQ from '../models/FAQ.js';
// import cacheService from '../services/cache.js';
import translationService from '../services/translator.js';

// Create new FAQ
router.post('/', [
  body('question').notEmpty().trim(),
  body('answer').notEmpty().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const faq = new FAQ({
      questions: { en: req.body.question },
      answers: { en: req.body.answer }
    });

    // Auto-translate to other languages
    for (const lang of ['hi', 'bn']) {
      faq.questions[lang] = await translationService.translateText(req.body.question, lang);
      faq.answers[lang] = await translationService.translateText(req.body.answer, lang);
    }

    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get FAQs with language support
router.get('/', [
  query('lang').optional().isIn(['en', 'hi', 'bn'])
], async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    // const cacheKey = `faqs_${lang}`;
    
    // Try to get from cache
    // const cachedData = await cacheService.get(cacheKey);
    // if (cachedData) {
    //   return res.json(cachedData);
    // }

    // Get from database
    const faqs = await FAQ.find({ isActive: true });
    const translatedFaqs = await Promise.all(faqs.map(async (faq) => ({
      id: faq._id,
      question: await faq.getTranslation('questions', lang),
      answer: await faq.getTranslation('answers', lang),
      createdAt: faq.createdAt
    })));

    // Cache the results
    // await cacheService.set(cacheKey, translatedFaqs);
    res.json(translatedFaqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
