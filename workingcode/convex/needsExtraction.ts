import { text } from "stream/consumers";
import { chatCompletion, visualQuery, ChatCompletionParams, visualQueryParams } from "./util/llm";

function isValidResponse(response: any): boolean {
    const validKeys = ["needForAcceptance", "needForOptimalPredictability", "needForCompetence"];
    const validValues = [0, 1, "NA"];

    if (typeof response !== 'object' || response === null) return false;

    for (const key of validKeys) {
        if (!(key in response) || !validValues.includes(response[key])) {
            return false;
        }
    }
    return true;
}

export async function extractNeedsFromText(text: string){
    const introductionAboutNeeds = `
    There're three fundamental psychological needs are identified as crucial to human motivation and personality development. 
    They are:
    1. Need for Acceptance: This need reflects the desire for positive social engagement and supportive relationships. It involves being accepted and valued by others, which is critical for social bonding and emotional well-being.

    2. Need for Optimal Predictability: This need pertains to understanding the relationships among events in one's environment—essentially knowing what to expect and being able to predict outcomes. It helps individuals make sense of their surroundings and reduces uncertainty.
    
    3. Need for Competence: This need involves the desire to be effective in interacting with the environment and achieving goals. It encompasses skills and abilities that enable individuals to navigate their world successfully.

    Given these three needs, you will extract whether the person who wrote the text has met the need for acceptance, need for optimal predictability, or need for competence.

    You answer should be a dictionary, in which 1 means it has been met and 0 means it has not been met:
    {
        "needForAcceptance": 0 | 1 | NA,
        "needForOptimalPredictability": 0 | 1 | NA, 
        "needForCompetence": 0 | 1 | NA
    }
    `
    const examplesAboutNeeds = `
    Here's a few examples: 
    1. "Yesterday was a very productive day at work for me. I finished all of my work for my real-world job very quickly, and was able to also make over $100 on Mechanical Turk, which will help tremendously with getting out from under some past due bills currently weighing on me."
    The conclusion that should be extracted from this text is 
    {
        "needForAcceptance": NA,
        "needForOptimalPredictability": 1, 
        "needForCompetence": 1
    }
    2. "Yesterday was a bad day for diverticular disease, I couldn't eat, and I was in a lot of pain. Still, I was able to function through it, and I know that if I'm patient the pain will go away eventually. I just wish there was a more permanent solution."
    The conclusion that should be extracted from this text is 
    {
        "needForAcceptance": NA,
        "needForOptimalPredictability": 0, 
        "needForCompetence": 0
    }
    3. "Yesterday I worked online most of the day. I discovered an assignment I had done the previous day was rejected. This assignment provided a considerable reward so I basically lost about an hour's worth of work. That was frustrating. We need the money I am making onine right now to pay our bills so I was also concerned about making enough money. However at the end of the day I hit my earnings goal so I was satisfied with my progress and I also received blessings from my friends."
    The conclusion that should be extracted from this text is 
    {
        "needForAcceptance": 1,
        "needForOptimalPredictability": 0, 
        "needForCompetence": 1
    }
    4. "Yesterday I was diagnosed with cancer. I don't know how to feel, right now I just feel empty and possibly in shock. I haven't told anyone yet. I just need time to process this alone right now."
    The conclusion that should be extracted from this text is 
    {
        "needForAcceptance": 0,
        "needForOptimalPredictability": 0, 
        "needForCompetence": 0
    }
    5. "I just got a promotion at work, and I called my parents, but they didn't seem very excited about it. I was kind of saddened by their apathetic reaction. I wish they could be proud of me."
    The conclusion that should be extracted from this text is 
    {
        "needForAcceptance": 0,
        "needForOptimalPredictability": 1, 
        "needForCompetence": 1
    }
    `

    const instruction = `
    Given the above examples, please extract the needs for acceptance, optimal predictability, and competence from the following text:
    please note that your answer should be a dictionary formatted as follows:
    {
        "needForAcceptance": 0 | 1 | NA,
        "needForOptimalPredictability": 0 | 1 | NA, 
        "needForCompetence": 0 | 1 | NA
    }
    Please try your best to assign 0 or 1 to the needs, and NA only if you cannot determine at all.
    `

    let prompts = [
        `${introductionAboutNeeds}, 
        ${examplesAboutNeeds}, 
         ${instruction}`
    ]

    prompts.push(text)

    const params = {
        model: "gpt-4",
        messages: [
            { role: 'user' as "user", content: prompts.join(' ')}
        ],
        max_tokens: 1000,
    }

    try {
        const response = await chatCompletion(params);
        const result = JSON.parse(response.choices[0].message.content.replace(/NA/g, '"NA"'));
        if (isValidResponse(result)) {
            console.log('Valid Response:', result);
        } else {
            console.error('Invalid Response:', result);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
