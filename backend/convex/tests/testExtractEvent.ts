import { extractEvent } from "../Memory/extractEvent";

export function testExtractEvent() {
    const event = extractEvent("I went to the store and bought some food.");
    console.log(event);
}

testExtractEvent();