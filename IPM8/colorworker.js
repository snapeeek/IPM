onmessage = function (e) {
    var tempJSON = JSON.parse(e.data);
    //console.log("Poka worker")
    //console.log(tempJSON)

    var sum = 0
    sum += countletters(tempJSON["name"])
    sum += countletters(tempJSON["surname"])
    sum += countletters(tempJSON["email"])
    sum += countletters(tempJSON["phone"])
    sum += countletters(tempJSON["link"])

    console.log(sum)

    var R = sum % 255
    var G = 255 - R;
    var B = (0.5*R>125)?99:199

    dict = {
        R: R,
        G: G,
        B: B,
        link: tempJSON["link"]
    }

    //console.log(tempJSON)
    postMessage(JSON.stringify(dict));
};

var isAlpha = function(ch){
  return /^[A-Z]$/i.test(ch);
}

function countletters(str) {
    var result = 0;
    for (i = 0; i < str.length; i++) {
        if (isAlpha(str[i])) {
            if (str[i] == str[i].toLowerCase()) {
                result += str.charCodeAt(i) - 96;
            } else {
                var test = str[i].toLowerCase()
                result +=  test.charCodeAt(0) - 66;
            }
        }
    }
    return result;
}