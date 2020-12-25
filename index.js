// Add URL-age and that stuff.
// https://www.w3schools.com/nodejs/nodejs_url.asp

const http = require('http');

// http://localhost:3000

const hostname = '127.0.0.1';
const port = 3000;

const webpage = {
  PREContent: [
    "Hi Dude!",
    "You used this url ending:",
    "$url"
  ],
  lineSeperator: '<br>',
  parseContent: (contentArr, request) => {
    let acc = "<div style=\"background-color: black; font-family: Consolas, sans-serif; color: white;\">";
    for (var i = 0; i < contentArr.length; i++) {
      acc += contentArr[i]
      .replaceAll("$url", request.url)
      .replaceAll("$reqAll",
      Object.getOwnPropertyNames(request)
      .join(", "))
      .replaceAll("$reqVal", deepSafeObjectReader(request, 0));

      acc += webpage.lineSeperator;
    }
    return acc + "</div>";
  },
  propertyIndent: 50,
  maxRuns: 3,
  typeofColors: {
    "string": "brown",
    "undefined": "red",
    "null": "red",
    "number": "green",
    "function": "blue",
    "boolean": "purple"
  }
};

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.writeHead(200,{"Content-Type" : "text/html"});
  response.write(webpage.parseContent(webpage.PREContent, request));
  response.end();
  console.log("Ended Response.");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



function colorString(str, clr) {
  if (clr == undefined) {
    return str;
  }
  return `<b style=\"color: ${clr};\">${str}</b>`;
}

function deepSafeObjectReader(obj, runs) {
  console.log(typeof obj + " " + runs);
  var color = webpage.typeofColors[typeof obj];
  if (obj === undefined) {
    return colorString("undefined", color);
  }
  if (obj === null) {
    return colorString("null", webpage.typeofColors[obj]);
  }
  if ((typeof obj) === "string") {
    return colorString(`\"${obj}\"`, color);
  }
  if ((typeof obj) === "number") {
    return colorString(`${obj}`, color);
  }
  if ((typeof obj) === "function") {
    return colorString(`function ${obj.name}(${obj.length == 0 ? "" : obj.length})`, color);
  }
  if ((typeof obj) === "boolean") {
    return colorString(`${obj.toString()}`, color);
  }
  if (runs >= webpage.maxRuns) {
    return "<i>...</i>";
  }
  var str = "{<br>";
  for (const [key, value] of Object.entries(obj)) {
    str +=
    `<b style=\"margin-left: ${webpage.propertyIndent * runs}px;\">` +
    `${key}: ${deepSafeObjectReader(value, runs+1)}</b>,<br>`;
  }
  str += "}";
  return str;
}
