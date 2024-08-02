import { extractEvent } from "../extractEvent";

export function testExtractEvent() {
    const event = extractEvent("I went to the store and bought some food.");
    console.log(event);
}

testExtractEvent();