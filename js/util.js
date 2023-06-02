/**
 *  Let all data live in the utility class as it will be using it the most
 *
 */
let trackCorrect = 0
let trackIncorrect = 0
let questionStartTime = null
let questionElapsedTime = null
let firstAttemptCorrect = true
let durationTime = 0
let currentTime = 0

// function sendStatement() {
//
//     let statement = {
//         "actor": {
//             "mbox": "mailto:test@gmail.com",
//             "name": "test",
//             "objectType": "Agent"
//         },
//         "verb": {
//             "id": "http://adlnet.gov/expapi/verbs/attempted",
//             "display": {
//                 "en-US": "attempted"
//             }
//         },
//         "object": {
//             "id": "http://test.com/xapi/test",
//             "definition": {
//                 "name": {
//                     "en-US": "Test Activity"
//                 },
//                 "description": {
//                     "en-US": "Test activity description"
//                 }
//             },
//             "objectType": "Activity"
//         }
//     }
//     ADL.XAPIWrapper.sendStatement(statement);
//     alert("Statement Fired!")
//
// }


// Main Variables
let video = document.getElementById('english_video');
let videoHalfWay;
let SD = window.parent;
let runHalfOnce = false;

// xAPI variables
let email = "test@gmail.com";
let name = "Default User";
let verb = "";
let objectDesc = "";
let alertMsg = document.getElementById("alertMsg");

// xAPI Basic Statement
function sendBasicStatement(verbID, verb, objectName, objectDesc){
    let statement = {
        "actor": {
            "mbox": "mailto:"+email,
            "name": name,
            "name": name,
            "objectType": "Agent"
        },
        "verb": {
            "id": verbID,
            "display": {
                "en-US": verb
            }
        },
        "object": {
            "id": config.courseURI,
            "definition": {
                "name": {
                    "en-US": objectName
                },
                "description": {
                    "en-US": objectDesc
                }
            },
            "objectType": "Activity"
        }
    };
    console.log("SENDING ", statement)
    ADL.XAPIWrapper.sendStatement(statement);
}
function sendQuizUpdate(questionName, correctAnswer, selectedAnswer, answerArray, duration){
    const verbID = "http://adlnet.gov/expapi/verbs/answered"
    const verb = "answered"

    const objectID = "http://test.com"
    const rightOrWrong = (selectedAnswer === correctAnswer[0])
    const rawScore = rightOrWrong ? 1 : 0

    let statement = {
        "actor": {
            "mbox": "mailto:"+email, // TODO Placeholder
            "name": name, // TODO Placeholder
            "objectType": "Agent"
        },
        "verb": {
            "id": verbID,
            "display": {
                "en-US": verb
            }
        },
        "object": {
            "id": objectID,
            "definition": {
                "name": {
                    "en-US": questionName
                },
                "description": {
                    "en-US": questionName // TODO Placeholder
                },
                "type": "http://adlnet.gov/expapi/activities/cmi.interaction",
                "interactionType": "choice",
                "correctResponsesPattern": correctAnswer,
                "choices": answerArray
            },
            "objectType": "Activity"
        },
        "result": {
            "success": rightOrWrong,
            "duration": duration,
            "response": selectedAnswer,
            "score": {
                "raw": rawScore
            }
        }
    };
    console.log("SENDING ", statement)
    ADL.XAPIWrapper.sendStatement(statement);
}

function sendQuizComplete(){
    const scaledGrade = trackCorrect / config.numQuestions
    const passOrFail = (scaledGrade > (config.passingGrade / 100))
    const rawScore = scaledGrade * 100

    const objectName = config.courseName + "_" + config.quizName
    const verbID =
        passOrFail ? "http://adlnet.gov/expapi/verbs/passed" : "http://adlnet.gov/expapi/verbs/failed"
    const verb = passOrFail ? "passed" : "failed"

    let statement = {
        "actor": {
            "mbox": "mailto:"+email, // TODO Placeholder
            "name": name, // TODO Placeholder
            "objectType": "Agent"
        },
        "verb": {
            "id": verbID,
            "display": {
                "en-US": verb
            }
        },
        "object": {
            "id": config.courseURI,
            "definition": {
                "name": {
                    "en-US": objectName
                },
                "description": {
                    "en-US": objectName // TODO Placeholder
                }
            },
            "objectType": "Activity"
        },
        "result": {
            "success": passOrFail,
            "score" : {
                "scaled": scaledGrade,
                "min": config.minGrade,
                "max": config.maxGrade,
                "raw": rawScore
            }
        }
    };
    console.log("SENDING ", statement)
    ADL.XAPIWrapper.sendStatement(statement);
}

// TODO Streamline this entire function, done now quick and dirty
function parseQuestionAndUpdate() {

    const questionName = $(".eng_qs_wrap .question_wrap.active .white_wrap .qstn_wrap .question")[0].innerText
    let answerArray = []
    let currAnswer = {}
    let correctAnswer = ""
    let selectedAnswer = ""

    $(".eng_qs_wrap .question_wrap.active .white_wrap .qstn_wrap .ans_option").children().each(function() {
        let answerName = $(this).find(".label_text")[0].innerText

        currAnswer.id = answerName
        currAnswer.description = {
            "und": answerName
        }

        // If the selector query returns an array of more than 0 this is checked
        let x = $(this).find("input[type=radio]:checked")
        if(x.length === 1) {
            selectedAnswer = answerName
        }

        // If the input this input is the correct answer
        if($(this).find("input[type=radio]").val() == 1) {
            correctAnswer = answerName
        }

        answerArray.push(currAnswer)

        currAnswer = {}
    })

    // Update the correct/incorrect trackers
    if((correctAnswer === selectedAnswer) && firstAttemptCorrect){
        trackCorrect++
    } else if((correctAnswer === selectedAnswer) && !firstAttemptCorrect) {
        trackIncorrect++
    }

    sendQuizUpdate(questionName, [correctAnswer], selectedAnswer, answerArray, milliToISO8601(questionElapsedTime))


}

function parseQuizResults() {
    sendQuizComplete()
}

function milliToISO8601(milliseconds) {

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    const durationComponents = [];

    if (years > 0) {
        durationComponents.push(`${years}Y`);
    }
    if (months > 0) {
        durationComponents.push(`${months % 12}M`);
    }
    if (days > 0) {
        durationComponents.push(`${days % 30}D`);
    }

    if (hours > 0 || minutes > 0 || seconds > 0) {
        durationComponents.push('T');

        if (hours > 0) {
            durationComponents.push(`${hours % 24}H`);
        }
        if (minutes > 0) {
            durationComponents.push(`${minutes % 60}M`);
        }
        if (seconds > 0) {
            const millisecondsWithDecimal = (milliseconds % 1000) / 1000;
            const secondsWithDecimal = seconds % 60 + millisecondsWithDecimal;
            durationComponents.push(`${secondsWithDecimal.toFixed(2)}S`);
        }
    }

    return `P${durationComponents.join('')}`;
}

function updateElapsedTime() {
    questionElapsedTime += (Date.now() - questionStartTime)
}

function resetElapsedTime() {
    questionStartTime = new Date()
    questionElapsedTime = 0
}