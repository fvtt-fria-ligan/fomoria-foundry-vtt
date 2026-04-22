import { diceSound, showDice } from "../dice.js";

export async function rollDismalBreakdown(actor) {
    const roll = new Roll("1d10");
    await roll.evaluate();

    var key;

    switch(roll.total) {
        case 1:
            key = "Paranoia";
            break;    
        case 2:
            key = "HallucinatoryWhispers";
            break;    
        case 3:
            key = "ObsessiveRituals";
            break;    
        case 4:
            key = "MindsEclipse";
            break;    
        case 5:
            key = "Teratophobia";
            break;    
        case 6:
            key = "UnspeakableSight";
            break;    
        case 7:
            key = "Thanatophobia";
            break;    
        case 8:
            key = "Moth";
            break;    
        case 9:
            key = "Hypochondria";
            break;    
        case 10:
            key = "Flashbacks";
            break;    
    }

    const data = {
        // additionalRolls,
        // batteredRoll,
        // outcomeLines,
    };
    const html = await renderTemplate(BREAKDOWN_ROLL_CARD_TEMPLATE, data);
    ChatMessage.create({
        content: html,
        sound: diceSound(),
        speaker: ChatMessage.getSpeaker({ actor: actor }),
    });

}