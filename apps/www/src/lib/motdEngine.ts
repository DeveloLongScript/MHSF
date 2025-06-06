/*
 * MHSF, Minehut Server List
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

// rendering engine for MOTDs (aka Minehut)

const divList: any = {
  black: "black",
  dark_blue: "text-[#1D4ED8]",
  dark_green: "text-[#166634]",
  dark_red: "text-[#991b1b]",
  dark_purple: "text-[#6b21a8]",
  gold: "text-[#facc15]",
  gray: "text-[#4b5563]",
  dark_gray: "text-[#1f2937]",
  blue: "text-[#60a5fa]",
  green: "text-[#4ade80]",
  aqua: "text-[#22d3ee]",
  red: "text-[#f87171]",
  light_purple: "text-[#d8b4fe]",
  yellow: "text-[#facc15]",
  white: "text-white",
  strikethrough: "line-through",
  st: "line-through",
  u: "underline",
  underlined: "underline",
  italic: "italic",
  em: "italic",
  i: "italic",
  bold: "font-bold",
  b: "font-bold",
};

export default function parseToHTML(m: string, tw?: boolean): Promise<string> {
  return new Promise<string>((g, b) => {
    fetch("https://webui.advntr.dev/api/mini-to-json", {
      method: "POST",
      body: JSON.stringify({
        miniMessage: m,
        placeholders: { stringPlaceholders: {} },
      }),
    }).then((j) => {
      j.json().then((l) => {
        if (typeof l === "string") {
          g(l);
        } else {
          // This text has custom properties
          var allHTML = "";
          var root: Array<Element | string> = l.extra;
          if (root == undefined) {
            var curClass = "";
            var contents = "";
            if (l.color != undefined) {
              if (divList[l.color] == undefined) {
                curClass +=
                  curClass == ""
                    ? "text-[" + l.color + "]"
                    : " text-[" + l.color + "]";
              } else {
                curClass +=
                  curClass == "" ? divList[l.color] : " " + divList[l.color];
              }
            }
            if (l.strikethrough == true) {
              curClass += curClass == "" ? "line-through" : " line-through";
            }
            if (l.bold == true) {
              curClass += curClass == "" ? "font-bold" : " font-bold";
            }
            if (l.italic == true) {
              curClass += curClass == "" ? "italic" : " italic";
            }
            allHTML += createHTML("span", curClass, l.text + contents);
          } else {
            root.forEach(function (i) {
              if (typeof i === "string") {
                allHTML += i;
              } else {
                var curClass = "";
                var contents = "";
                if (i.extra != undefined) {
                  i.extra.forEach(function (m) {
                    contents += objToHTML(m);
                  });
                }
                if (i.color != undefined) {
                  if (divList[i.color] == undefined) {
                    curClass +=
                      curClass == ""
                        ? "text-[" + i.color + "]"
                        : " text-[" + i.color + "]";
                  } else {    
                    curClass +=
                      curClass == ""
                        ? divList[i.color]
                        : " " + divList[i.color];
                  }
                }
                if (i.strikethrough == true) {
                  curClass += curClass == "" ? "line-through" : " line-through";
                }
                if (i.bold == true) {
                  curClass += curClass == "" ? "font-bold" : " font-bold";
                }
                if (i.italic == true) {
                  curClass += curClass == "" ? "italic" : " italic";
                }
                allHTML += createHTML("span", curClass, l.text + contents);
              }
            });
          }
          g("<span>" + allHTML + "</span>");
        }
      });
      if (!j.ok) {
        b("Problem while parsing MiniMessage");
      }
    });
  });
}

function objToHTML(i: Element | string): string {
  if (typeof i == "string") {
    return i;
  }
  var curClass = "";
  var contents = "";
  if (i.extra != undefined) {
    i.extra.forEach((m) => {
      contents += objToHTML(m);
    });
  }
  if (i.color != undefined) {
    if (divList[i.color] == undefined) {
      curClass +=
        curClass == "" ? "text-[" + i.color + "]" : " text-[" + i.color + "]";
    } else {
      curClass += curClass == "" ? divList[i.color] : " " + divList[i.color];
    }
  }
  if (i.strikethrough == true) {
    curClass += curClass == "" ? "line-through" : " line-through";
  }
  if (i.bold == true) {
    curClass += curClass == "" ? "font-bold" : " font-bold";
  }
  if (i.italic == true) {
    curClass += curClass == "" ? "italic" : " italic";
  }

  return createHTML("span", curClass, i.text + contents);
}

function createHTML(
  tag: string,
  className: string,
  contents: string,
  tw?: boolean
) {
  if (className == undefined) className = "";
  if (contents == undefined) contents = "";
  if (contents == "\n") contents = "<br>";

  if (tw == false || tw == undefined) {
    return (
      "<" +
      tag +
      ' style="' +
      colorConvert(className) +
      '">' +
      contents +
      "</" +
      tag +
      ">"
    );
  } else {
    return (
      "<" + tag + ' class="' + className + '">' + contents + "</" + tag + ">"
    );
  }
}
type Element = {
  text: string;
  extra: Array<Element>;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
};

function colorConvert(className: string) {
  const classes = className.split(" ");
  let result = "";
  classes.forEach((classUnique) => {
    if (classUnique.startsWith("text-") && classUnique != "text-white") {
      if (classUnique.startsWith("text-[")) {
        result +=
          "color: " + classUnique.substring(6, classUnique.length - 1) + "; ";
      } else {
        result +=
          "color: " + classUnique.substring(5, classUnique.length) + "; ";
      }
    }
    if (classUnique.startsWith("font-bold")) {
      result += "font-weight: 700; ";
    }
    if (classUnique.startsWith("line-through")) {
      result += "text-decoration-line: line-through; ";
    }
    if (classUnique.startsWith("italic")) {
      result += "font-style: italic; ";
    }
  });

  return result;
}
