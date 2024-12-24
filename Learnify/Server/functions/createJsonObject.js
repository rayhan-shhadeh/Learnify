export  function createJSONFile( fileName,fileDeadline,fileURL,courseid) {
    const jsonObject = {
        "fileName": fileName,
        "fileDeadline": fileDeadline,
        "fileURL": fileURL ,
        "course":{
            "connect": {
              "courseId": courseid
            }
        }
    };
    return jsonObject;
}

export function createJSONFlashcard( name,Q,A,fileid) {
    const jsonObject = {
        "flashcardName": name,
        "flashcardQ": Q,
        "flashcardA": A ,
        "file":{
            "connect": {
              "fileId": fileid
            }
        }
    };
    return jsonObject;
}

export function createJSONkeyterm(key,def,fileid) {
    const jsonObject = {
        "keytermText": key,
        "keytermDef": def,
        "file":{
            "connect": {
              "fileId": fileid
            }
          }
        };
    return jsonObject;
} 

export  function createJSONQuiz( num,title ,description,fileid){
    const jsonObject = {
        "numOfQuestions": num ,
        "quizTitle": title,
        "quizDescription": description,
        "file":{
            "connect": {
              "fileId": fileid
            }
        }
    };
    return jsonObject;
}

export  function createJSONQuestion(question,correctAnswer,choices,quizid) {
    const jsonObject = {
        "questionText": question,
        "correctAnswer": correctAnswer,
        "choices": choices,
        "quiz": {
            "connect": {
              "quizId": quizid
            }
        }
    };
    return jsonObject;
}

export  function createJSONTopic(topicName) {
    const jsonObject = {
        "topicName": topicName,
    };
    return jsonObject;
}

export  function createJSONExploreFlashcard(Q,A,topicId) {
    const jsonObject = {
        "ExploreFlashcardQ": Q,
        "ExploreFlashcardA" : A,
        "topic": {
            "connect": {
              "topicId": topicId
            }
        }       
    };
    return jsonObject;
}

export function createJSONCompletion(habitId,currentDate,isCompleted){
    const jsonObject = {
        "habit": {
            "connect": {
              "habitId": habitId
            }
        },         
        "trackDate":currentDate,
        "isCompleted": isCompleted
    };
    return jsonObject;
}

export function createJSONStreak(habitId,currentStreak,longestStreak,lastUpdatedDate){
    const jsonObject = {
        "habit": {
            "connect": {
              "habitId": habitId
            }
        },       
        "currentStreak":currentStreak ,
        "longestStreak":longestStreak ,
        "lastUpdatedDate":lastUpdatedDate
    };
    return jsonObject;
}

export function createJSONTrack(trackDate,completeStatus){
    const jsonObject = {
        "trackDate":trackDate,
        "completeStatus":completeStatus
    };
    return jsonObject;
}

export function createJSONHabitStatus(habit,count){
    const jsonObject = {
        "habit":habit,
        "count":count
    };
    return jsonObject;
}

export function createJSONReview(flashcardId,interval,repetitions,nextReviewDate,easeFactor){
    const jsonObject = {
        "interval":interval,
        "repetitions":repetitions,
        "nextReviewDate":nextReviewDate,
        "easeFactor" : easeFactor ,
        "flashcard":{
            connect: { flashcardId: parseInt(flashcardId)}, // Use `connect` to link to an existing flashcard
        },

    };
    return jsonObject;
}

export function createJSONAnswer(chosenAnswer, isCorrect,questionId ){
    const jsonObject = {
        "chosenAnswer": chosenAnswer,
        "isCorrect": isCorrect,
        "question":{
        "connect": {
          "questionId": questionId
        }
    }
    };
    return jsonObject;
}
