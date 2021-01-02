// Add URL-age and that stuff.
// https://www.w3schools.com/nodejs/nodejs_url.asp

const http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// http://localhost:3000

const hostname = '127.0.0.1';
const port = 3000;

const options = {
  host: 'http://docs.oracle.com/javase/7/docs/api/java/awt/Color.html',
  response: null
};

const htmlParserOptions = {
  plainText: false,
  disableScripts: true
};

const webpage = {
  PREContent: [
    "Hi Dude!",
    "You used this url ending:",
    "$url",
    "Hello World!",
    "This is "+options.host,
    "$google"
  ],
  lineSeperator: '<br>',
  continuation: "...",
  parseContent: (contentArr, request) => {
    let acc = "<div style=\"background-color: black; font-family: Consolas, sans-serif; color: white;\">";
    for (var i = 0; i < contentArr.length; i++) {
      acc += contentArr[i]
      .replaceAll("$url", request.url)
      .replaceAll("$google", deepHTMLParser(options.response));
      //.replaceAll("$reqAll", Object.getOwnPropertyNames(request).join(", "))
      //.replaceAll("$reqVal", deepSafeObjectReader(request, 0))

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

var request = require("request");

var parseMyAwesomeHtml = function(html) {
    console.log("SUCCESS!");
    console.log(html);
    options.response = html;
};

request(options.host, function (error, response, body) {
    if (!error) {
        parseMyAwesomeHtml(body);
    } else {
        console.log(error);
    }
});


const colorString = (str, clr) => clr ? `<b style=\"color: ${clr};\">${str}</b>` : str;

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

function deepHTMLParser(options, text) {
  if (options.plainText) {
    return text.replaceAll("<", "&lt;");
  }
  const dom = new JSDOM(text);
  const { document } = dom.window;
  if (options.disableScripts) {
    document.querySelectorAll("script").forEach(element => {
      element.innerHTML = "";
      element.src = "";
    });
  }

  return document.documentElement.outerHTML;
}
