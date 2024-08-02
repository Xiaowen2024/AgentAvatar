import { extractEmotion } from "../extractEmotion";

const text = "Yesterday I worked online most of the day. I discovered an assignment I had done. The previous day was rejected. This assignment provided a considerable reward so I basically lost about an hour's worth of work. That was frustrating. We need the money I am making online right now to pay our bills so I was also concerned about making enough money. However, at the end of the day, I hit my earnings goal so I was satisfied with my progress.";

export function testExtractEmotion() {
    const event = extractEmotion(text);
    console.log(event);
}

testExtractEmotion();