// Add URL-age and that stuff.
// https://www.w3schools.com/nodejs/nodejs_url.asp

const http = require('http');
const fs = require('fs');
const jsdom = require("jsdom");
const url = require("url");
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
    "You used this url:",
    "http://localhost:3000$url",
    "Hello World!",
    "This is "+options.host
  ],
  lineSeperator: '<br>',
  continuation: "...",
  parseContent: (contentArr, request) => {
    let acc = "<div style=\"background-color: black; font-family: Consolas, sans-serif; color: white;\">";
    for (var i = 0; i < contentArr.length; i++) {
      acc += contentArr[i]
      .replaceAll("$url", request.url)
      //.replaceAll("$reqAll", Object.getOwnPropertyNames(request).join(", "))
      //.replaceAll("$reqVal", deepSafeObjectReader(request, 0))
      acc += webpage.lineSeperator;
    }
    acc += "</div>";
    acc += "<div id=\"response\">";
    acc += options.response;
    acc += "</div>";
    return acc;
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

const server = http.createServer(function(req, res){
  // your normal server code
  var path = url.parse(req.url).pathname;
  switch (path){
    case '/':
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(webpage.parseContent(webpage.PREContent, request));
    res.end();
    break;

    default:
    if (/\.(js|html|swf)$/.test(path)){
      try {
        var swf = path.substr(-4) === '.swf';
        res.writeHead(200, {'Content-Type': swf ? 'application/x-shockwave-flash' : ('text/' + (path.substr(-3) === '.js' ? 'javascript' : 'html'))});
        res.end();
      } catch(e){
        send404(res);
      }
      break;
    }
    else if (/\.(css)$/.test(path)){
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(fs.readFileSync(__dirname + "\\main.css", 'utf8'));
      res.end();
      break;
    }

    // send404(res);
    break;
  }
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
