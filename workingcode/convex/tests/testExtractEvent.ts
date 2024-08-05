import { extractEvent } from "../extractEvent";

export function testExtractEvent() {
    const event = extractEvent("She attended the conference in New York last week.");
    console.log(event);
}

testExtractEvent();