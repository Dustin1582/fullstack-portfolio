
const normalizeText = (input) => {
    if(!input){
        return "";
    }

    let value = String(input).toLowerCase();

    //catch spaced/punctuated words
    value = value.replace(/[\s._-]+/g, "")

    // Strip remaining non-alphanumerics
    value = value.replace(/[^a-z0-9]/g, "");

    // Optional, catches a common substitution like fvck -> fuck
    value = value.replace(/v/g, "u");

    return value;
}

module.exports = normalizeText