
import { diceSound, showDice } from "../dice.js";

export async function rollDireInjury(actor) {
    const roll = new Roll("1d10");
    await roll.evaluate();

    let outcomeLines = [];
    let additionalRolls = [];
    var key;
    var actorUpdate;

    // TODO: should each injury and breakdown be a Condition item?
    // and then the character has an effective ability score based on base +/- conditions?

    switch(roll.total) {
        case 1:
            key = "Decapitation";
            break;    
        case 2:
            key = "MauledTorso";
            actorUpdate = { 
                ["system.abilities.toughness.value"]: actor.system.abilities.toughness.value - 2,
            };
            break;    
        case 3:
            key = "SeveredArm";
            actorUpdate = { 
                ["system.abilities.strength.value"]: actor.system.abilities.strength.value - 2,
            };
            break;    
        case 4:
            key = "InternalHemorrhage";
            break;    
        case 5:
            key = "MangledMandible";
            actorUpdate = { 
                ["system.abilities.toughness.value"]: actor.system.abilities.toughness.value - 1,
                ["system.abilities.presence.value"]: actor.system.abilities.presence.value - 1,
            };
            break;    
        case 6:
            key = "FacialDisfigurement";
            actorUpdate = { 
                ["system.abilities.presence.value"]: actor.system.abilities.presence.value - 2,
            };
            break;    
        case 7:
            key = "MissingFingers";
            actorUpdate = { 
                ["system.abilities.agility.value"]: actor.system.abilities.agility.value - 1,
            };
            break;    
        case 8:
            key = "PiercedLung";
            actorUpdate = { 
                ["system.abilities.agility.value"]: actor.system.abilities.agility.value - 1,
                ["system.abilities.strength.value"]: actor.system.abilities.agility.value - 1,
            };
            break;    
        case 9:
            key = "BoneShards";
            break;    
        case 10:
            key = "Gutted";
            break;    
    }

    let title = game.i18n.localize(key);
    let text = game.i18n.localize(key + "Text");

    const data = {
        // additionalRolls,
        // batteredRoll,
        outcomeLines,
    };
    const html = await renderTemplate(INJURY_ROLL_CARD_TEMPLATE, data);
    ChatMessage.create({
        content: html,
        sound: diceSound(),
        speaker: ChatMessage.getSpeaker({ actor: actor }),
    });

    if (actorUpdate) {
        await actor.update(actorUpdate);
    // await actor.update({
    // ["system.abilities.strength.value"]: newStr,
    // ["system.abilities.agility.value"]: newAgi,
    // ["system.abilities.presence.value"]: newPre,
    // ["system.abilities.toughness.value"]: newTou,
    // ["system.abilities.occult.value"]: newKno,
    // ["system.hitPoints.max"]: newHp,
    // ["system.silver"]: newSilver,
//   });
    }
}
