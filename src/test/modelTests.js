import {expect} from 'chai';

import FAQ from '../models/FAQ.js'; // Adjust path as needed

describe('FAQ Model', () => {
  let faqInstance;

  beforeEach(async () => {
    // Create a test FAQ instance with multilingual content
    faqInstance = new FAQ({
      questions: {
        en: 'What is MongoDB?',
        hi: 'MongoDB क्या है?',
        bn: 'MongoDB কী?'
      },
      answers: {
        en: 'A NoSQL database',
        hi: 'एक NoSQL डेटाबेस',
        bn: 'একটি NoSQL ডেটাবেস'
      }
    });
  });

  describe('Schema Validation', () => {
    it('should create a valid FAQ document', async () => {
      await faqInstance.validate();
    });

    it('should have default isActive as true', () => {
      expect(faqInstance.isActive).to.be.true;
    });
  });

  describe('getTranslation Method', () => {
    it('should return English content for supported language', async () => {
      const question = await faqInstance.getTranslation('questions', 'hi');
      expect(question).to.equal('MongoDB क्या है?');
    });

    it('should fallback to English for unsupported language', async () => {
      const answer = await faqInstance.getTranslation('answers', 'es');
      expect(answer).to.equal('A NoSQL database');
    });

    it('should return English content if translation is missing', async () => {
      const testFaq = new FAQ({
        questions: { en: 'Test Question' },
        answers: { en: 'Test Answer' }
      });

      const question = await testFaq.getTranslation('questions', 'hi');
      expect(question).to.equal('Test Question');
    });
  });
});