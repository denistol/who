import {
    collection,
    getDocs,
    query,
} from 'firebase/firestore';

import { db } from '@services/db.service';
import { Question } from '@/types';
import { shuffleArray } from '@/utils';

const COLLECTION_NAME = 'questions'
const QUESTIONS_PER_LEVEL = 2
const MAX_LEVEL = 6

class QuestionService {

    private collection = collection(db, COLLECTION_NAME).withConverter<Question>({
        toFirestore: (data) => data,
        fromFirestore: (snapshot) => snapshot.data() as Question,
    })

    async getAll(): Promise<Question[]> {
        const q = query(this.collection);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => doc.data())
    }

    async getSessionQuestions(): Promise<Question[]> {

        const questions = await this.getAll()

        const result: Question[] = []

        for (let level = 1; level <= MAX_LEVEL; level++) {
            const filtered = questions.filter(q => q.difficulty === level)
            const shuffled = shuffleArray(filtered)
            result.push(...shuffled.slice(0, QUESTIONS_PER_LEVEL))
        }

        return result
    }

}

export const questionService = new QuestionService()
