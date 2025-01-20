export  function createJSONFile( fileName,fileDeadline,fileURL,courseid,numberOfPages) {
    console.log(fileDeadline);
    const jsonObject = {
        "fileName": fileName,
        "fileDeadline": fileDeadline,
        "fileURL": fileURL ,
        "practiceCount":0,
        "numberOfPages":numberOfPages,
        "course":{
            "connect": {
              "courseId": courseid
            }
        }
    };
    return jsonObject;
}

export function createJSONFlashcard( name,Q,A,fileid, page,type) {
    const jsonObject = {
        "flashcardName": name,
        "flashcardQ": Q,
        "flashcardA": A ,
        "page" : page,
        "type":type,
        "file":{
            "connect": {
              "fileId": parseInt(fileid)
            }
        }
    };
    return jsonObject;
}

export function createJSONkeyterm(key,def,fileid,page,type) {
    const jsonObject = {
        "keytermText": key,
        "keytermDef": def,
        "page" : page,
        "type":type,
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
        },
        "score" : 0
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

export  function createJSONTopic(topicName,level) {
    const jsonObject = {
        "topicName": topicName,
        "level":level
    };
    return jsonObject;
}

export  function createJSONExploreFlashcard(Q,A,topicId) {
    const jsonObject = {
        "ExploreFlashcardQ": Q,
        "ExploreFlashcardA" : A,
        "topic": {
            "connect": {
              "topiclevelId": topicId
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

export function createJSONExploreHistory(userId,topiclevelId){
    const jsonObject = {
        "user_": {
            "connect": {
              "userId": userId
            }
        },
        "topiclevel": {
            "connect": {
              "topiclevelId": topiclevelId
            }
        }                    
    };
    return jsonObject;
}

export function createJSONStatistics(falshcardsCount,keytermsCount,quizzesCount,exploreTopicsCont,habitsDoneToday,habitsCount, groupsCreated){
    const jsonObject = {
        "falshcardsCount":falshcardsCount,
        "keytermsCount":keytermsCount,
        "quizzesCount":quizzesCount,
        "exploreTopicsCount":exploreTopicsCont,
        "habitsDoneTodayCount":habitsDoneToday,
        "habitsCount":habitsCount,
        "groupsCreated":groupsCreated
    };
    return jsonObject;
}

export function createJSONCard(cardNumber,cardholderName,cvv,expirationMonth,expirationYear,cardType,userId){
    const jsonObject = {
        "cardNumber":cardNumber,
        "cardHolderName":cardholderName,
        "cvc":cvv,
        "expirationMonth":expirationMonth,
        "expirationYear":expirationYear,
        "cardType":cardType,
        "user_": {
            "connect": {
             "userId": userId
            }
        },
    };
    return jsonObject;
}

export function createJSONTransaction(transactionId,userId,cardId,amount,createdAt,endsAt){
    const jsonObject = {
        "transactionId":transactionId,
        "user_": {
            "connect": {
             "userId": userId
            }
        },
        "card": {
            "connect": {
              "cardId": cardId
            }
        },
        "amount":amount,
        "createdAt":createdAt,
        "endsAt":endsAt
    };
    return jsonObject;
}