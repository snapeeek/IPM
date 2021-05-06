onmessage = function (e) {
    var tempJSON = JSON.parse(e.data);
    for (var i = 0; i < tempJSON.length; i++)
    {
        tempJSON[i]["name"] = caseSwapper(tempJSON[i]["name"]);
        tempJSON[i]["surname"] =  caseSwapper(tempJSON[i]["surname"]);
        tempJSON[i]["phone"] =  caseSwapper(tempJSON[i]["phone"]);
        tempJSON[i]["email"] =  caseSwapper(tempJSON[i]["email"]);
    }

    //console.log(tempJSON)
    postMessage(JSON.stringify(tempJSON));
};

function caseSwapper(string)
{
    var word = []
    for (i = 0; i < string.length; i++)
    {
        if (string[i] === string[i].toUpperCase())
        {
            word[i] = string[i].toLowerCase();
        }
        else
        {
            word[i] = string[i].toUpperCase();
        }
    }

    return word.join("");
}