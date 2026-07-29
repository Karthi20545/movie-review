const fs = require('fs');
const code = fs.readFileSync('C:\\\\Users\\\\Admin\\\\.gemini\\\\antigravity-ide\\\\brain\\\\8fbebfd4-fbe4-447b-b6f7-8ff6dcbf1a00\\\\.system_generated\\\\steps\\\\124\\\\content.md', 'utf8');
const urlRegex = /https?:\/\/[^\s"'`]+?(?:jpg|jpeg|png|webp|gif)/gi;
const matches = code.match(urlRegex);
if (matches) {
    console.log(Array.from(new Set(matches)).join('\n'));
} else {
    console.log("No URLs found");
}
